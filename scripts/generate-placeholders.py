#!/usr/bin/env python3
"""
Generates the cinematic *placeholder* artwork used until real Rule Of Thirds
photographs are supplied. Every image is procedurally drawn (stage light,
haze, silhouettes, bokeh, grain) so nothing here is presented as client work.

Usage:  python3 scripts/generate-placeholders.py
Output: public/images/placeholders/<name>-<width>.webp  (+ public/og-image.jpg)

To use real photography instead, drop files into public/images/ and point
src/content/portfolio.ts (or src/config/media.ts) at them. No need to run this.
"""
from __future__ import annotations

import math
import os
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "placeholders"
FONTS = Path(__file__).resolve().parent / "fonts"

WARM = np.array([1.0, 0.86, 0.66])
GOLD = np.array([0.78, 0.66, 0.47])
IVORY = np.array([0.96, 0.94, 0.91])
AMBER = np.array([1.0, 0.62, 0.32])
EMBER = np.array([0.85, 0.36, 0.22])
COOL = np.array([0.55, 0.62, 0.72])


# --------------------------------------------------------------------------- #
# Primitives (all operate on float32 HxWx3 arrays in linear-ish 0..1 space)
# --------------------------------------------------------------------------- #
def grid(w, h):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    return x / w, y / h


def base(w, h, top=(0.07, 0.065, 0.06), bottom=(0.025, 0.024, 0.022)):
    _, y = grid(w, h)
    t, b = np.array(top), np.array(bottom)
    return (t[None, None, :] * (1 - y[..., None]) + b[None, None, :] * y[..., None]).astype(np.float32)


def glow(img, cx, cy, rx, ry, color, strength=1.0, power=2.0):
    h, w, _ = img.shape
    x, y = grid(w, h)
    d = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2)
    f = np.clip(1 - d, 0, 1) ** power
    img += f[..., None] * np.asarray(color) * strength
    return img


def cone(img, ox, oy, angle, spread, length, color, strength=0.6, soft=2.2):
    """Volumetric spotlight beam from (ox, oy) pointing at `angle` (radians, 0 = down)."""
    h, w, _ = img.shape
    x, y = grid(w, h)
    aspect = w / h
    dx, dy = (x - ox) * aspect, (y - oy)
    dist = np.sqrt(dx ** 2 + dy ** 2) + 1e-6
    a = np.arctan2(dx, dy) - angle
    a = (a + np.pi) % (2 * np.pi) - np.pi
    across = np.clip(1 - np.abs(a) / spread, 0, 1) ** soft
    along = np.clip(1 - dist / length, 0, 1) ** 1.2
    near = np.clip(dist * 6, 0, 1)
    img += (across * along * near)[..., None] * np.asarray(color) * strength
    return img


def haze(img, rng, strength=0.05, scale=6):
    h, w, _ = img.shape
    small = rng.random((max(2, h // (h // scale + 1)), max(2, w // (w // scale + 1)))).astype(np.float32)
    n = np.asarray(Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)) / 255.0
    n = np.asarray(Image.fromarray((n * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(w / 25))) / 255.0
    img *= (1 - strength) + strength * 2 * n[..., None]
    return img


def bokeh(img, rng, n, region, rmin, rmax, colors, strength=0.35):
    h, w, _ = img.shape
    layer = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = region
    for _ in range(n):
        r = rng.uniform(rmin, rmax) * w
        cx, cy = rng.uniform(x0, x1) * w, rng.uniform(y0, y1) * h
        c = colors[rng.integers(len(colors))] * rng.uniform(0.35, 1.0)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=tuple(int(v * 255) for v in c))
    layer = layer.filter(ImageFilter.GaussianBlur(w * rmin * 0.35))
    img += np.asarray(layer, dtype=np.float32) / 255.0 * strength
    return img


def string_lights(img, rng, rows, w, h, strength=0.9):
    layer = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(layer)
    for (y_start, sag, count) in rows:
        for i in range(count):
            t = i / (count - 1)
            x = t * w * 1.1 - w * 0.05
            y = (y_start + sag * math.sin(math.pi * t)) * h
            r = w * 0.0035 * rng.uniform(0.7, 1.3)
            d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 214, 160))
    soft = layer.filter(ImageFilter.GaussianBlur(w * 0.006))
    img += (np.asarray(soft, dtype=np.float32) / 255.0) * strength * 1.6
    img += (np.asarray(layer.filter(ImageFilter.GaussianBlur(1)), dtype=np.float32) / 255.0) * strength * 0.5
    return img


def silhouette(img, mask, rim_color=WARM, rim=0.8, rim_offset=(0, -1), body=0.012):
    """Composite a dark figure with a light rim from `mask` (L-mode PIL image)."""
    w, h = mask.size
    mask = mask.filter(ImageFilter.GaussianBlur(max(1, w / 420)))
    m = np.asarray(mask, dtype=np.float32) / 255.0
    ox, oy = rim_offset
    k = max(2, int(w / 260))
    shifted = mask.transform(mask.size, Image.AFFINE, (1, 0, ox * k, 0, 1, oy * k))
    edge = np.clip(m - np.asarray(shifted, dtype=np.float32) / 255.0, 0, 1)
    edge_img = Image.fromarray((edge * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(max(1, w / 500)))
    edge = np.asarray(edge_img, dtype=np.float32) / 255.0
    img *= 1 - m[..., None] * 0.94
    img += m[..., None] * body
    img += edge[..., None] * np.asarray(rim_color) * rim
    return img


def letterbox(img, ratio=2.39):
    h, w, _ = img.shape
    target = w / ratio
    bar = int(max(0, (h - target) / 2))
    if bar:
        img[:bar] *= 0.04
        img[-bar:] *= 0.04
    return img


def vignette(img, strength=0.55, roundness=1.6):
    h, w, _ = img.shape
    x, y = grid(w, h)
    d = np.sqrt(((x - 0.5) * 2) ** 2 + ((y - 0.5) * 2 * (h / w) ** 0.3) ** 2) / math.sqrt(2)
    img *= (1 - strength * np.clip(d, 0, 1) ** roundness)[..., None]
    return img


def leak(img, side, color, strength=0.18):
    h, w, _ = img.shape
    cx = -0.1 if side == "left" else 1.1
    return glow(img, cx, 0.25, 0.55, 0.9, color, strength, power=1.6)


def finish(img, rng, grain=0.014, vig=0.55):
    img = vignette(img, vig)
    img = np.clip(img, 0, None)
    img = img / (1 + img * 0.35)              # soft filmic shoulder
    img = img ** (1 / 1.08)
    h, w, _ = img.shape
    noise = rng.normal(0, 1, (h, w, 1)).astype(np.float32)
    img += noise * grain * (0.6 + 0.4 * (1 - img.mean(axis=2, keepdims=True)))
    return np.clip(img, 0, 1)


def ell(d, a, b):
    """Ellipse between two corner points in any order."""
    d.ellipse([min(a[0], b[0]), min(a[1], b[1]), max(a[0], b[0]), max(a[1], b[1])], fill=255)


# --------------------------------------------------------------------------- #
# Figures
# --------------------------------------------------------------------------- #
def dancer_mask(w, h, cx, base_y, scale, pose=0, flip=False):
    """Stylised Bharatanatyam silhouette in aramandi (half-sitting) pose."""
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    s = scale * h

    def P(x, y):
        x = -x if flip else x
        return (cx * w + x * s, base_y * h - y * s)

    def limb(a, b, width):
        d.line([P(*a), P(*b)], fill=255, width=max(2, int(width * s)), joint="curve")
        r = width * s / 2
        for p in (a, b):
            q = P(*p)
            d.ellipse([q[0] - r, q[1] - r, q[0] + r, q[1] + r], fill=255)

    hip = (0.0, 0.50)
    # legs in diamond / aramandi
    limb((-0.06, 0.50), (-0.26, 0.29), 0.075)
    limb((-0.26, 0.29), (-0.16, 0.03), 0.06)
    limb((0.06, 0.50), (0.26, 0.29), 0.075)
    limb((0.26, 0.29), (0.16, 0.03), 0.06)
    d.polygon([P(-0.22, 0.0), P(-0.08, 0.0), P(-0.14, 0.05)], fill=255)
    d.polygon([P(0.22, 0.0), P(0.08, 0.0), P(0.14, 0.05)], fill=255)
    # pleated fan between the knees
    fan = [P(0, 0.50)] + [P(0.2 * math.sin(t), 0.50 - 0.22 * math.cos(t) * 1.0)
                          for t in np.linspace(-1.15, 1.15, 14)]
    d.polygon(fan, fill=255)
    # hips + torso + waist
    d.polygon([P(-0.15, 0.44), P(0.15, 0.44), P(0.1, 0.58), P(-0.1, 0.58)], fill=255)
    d.polygon([P(-0.1, 0.50), P(0.1, 0.50), P(0.13, 0.80), P(-0.13, 0.80)], fill=255)
    ell(d, P(-0.12, 0.84), P(0.12, 0.74))
    # neck + head + bun
    limb((0, 0.80), (0, 0.88), 0.05)
    hx, hy = P(0.0, 0.93)
    r = 0.062 * s
    d.ellipse([hx - r, hy - r * 1.15, hx + r, hy + r * 1.05], fill=255)
    bx, by = P(-0.07, 0.94)
    d.ellipse([bx - r * 0.55, by - r * 0.55, bx + r * 0.55, by + r * 0.55], fill=255)
    # arms
    if pose == 0:   # one arm extended, one bent at chest (classic adavu)
        limb((0.10, 0.79), (0.30, 0.80), 0.045)
        limb((0.30, 0.80), (0.50, 0.86), 0.038)
        limb((-0.10, 0.79), (-0.22, 0.70), 0.045)
        limb((-0.22, 0.70), (-0.05, 0.70), 0.038)
        hand = P(0.53, 0.88)
    elif pose == 1:  # both arms raised in an arc
        limb((0.10, 0.79), (0.22, 0.98), 0.045)
        limb((0.22, 0.98), (0.06, 1.14), 0.038)
        limb((-0.10, 0.79), (-0.22, 0.98), 0.045)
        limb((-0.22, 0.98), (-0.06, 1.14), 0.038)
        hand = P(0.0, 1.17)
    else:            # arms stretched sideways
        limb((0.10, 0.79), (0.32, 0.77), 0.045)
        limb((0.32, 0.77), (0.54, 0.74), 0.038)
        limb((-0.10, 0.79), (-0.32, 0.77), 0.045)
        limb((-0.32, 0.77), (-0.54, 0.74), 0.038)
        hand = P(-0.57, 0.74)
    r = 0.028 * s
    d.ellipse([hand[0] - r, hand[1] - r, hand[0] + r, hand[1] + r], fill=255)
    return m


def portrait_mask(w, h, cx, cy, scale, tilt=0.0):
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    s = scale * h
    hx, hy = cx * w + tilt * s, cy * h
    d.ellipse([hx - 0.17 * s, hy - 0.23 * s, hx + 0.17 * s, hy + 0.21 * s], fill=255)
    d.polygon([(hx - 0.09 * s, hy + 0.12 * s), (hx + 0.09 * s, hy + 0.12 * s),
               (hx + 0.11 * s, hy + 0.36 * s), (hx - 0.11 * s, hy + 0.36 * s)], fill=255)
    d.ellipse([hx - 0.78 * s, hy + 0.31 * s, hx + 0.78 * s, hy + 2.6 * s], fill=255)
    # hair volume
    d.ellipse([hx - 0.2 * s, hy - 0.27 * s, hx + 0.16 * s, hy + 0.05 * s], fill=255)
    return m.filter(ImageFilter.GaussianBlur(s * 0.004))


def performer_mask(w, h, cx, base_y, scale, instrument="mic"):
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    s = scale * h

    def P(x, y):
        return (cx * w + x * s, base_y * h - y * s)

    d.polygon([P(-0.12, 0), P(-0.03, 0), P(-0.02, 0.48), P(-0.1, 0.48)], fill=255)
    d.polygon([P(0.03, 0), P(0.12, 0), P(0.1, 0.48), P(0.02, 0.48)], fill=255)
    d.polygon([P(-0.13, 0.46), P(0.13, 0.46), P(0.16, 0.82), P(-0.16, 0.82)], fill=255)
    hx, hy = P(0, 0.92)
    r = 0.075 * s
    d.ellipse([hx - r, hy - r * 1.1, hx + r, hy + r], fill=255)
    if instrument == "mic":
        d.line([P(0.15, 0.80), P(0.30, 0.70), P(0.12, 0.88)], fill=255, width=int(0.05 * s), joint="curve")
        d.line([P(0.08, 0), P(0.08, 0.86)], fill=255, width=max(2, int(0.012 * s)))
        d.line([P(0.08, 0.86), P(0.04, 0.9)], fill=255, width=max(2, int(0.02 * s)))
        d.line([P(-0.15, 0.80), P(-0.38, 1.12)], fill=255, width=int(0.045 * s))
    else:  # violin
        d.line([P(-0.15, 0.80), P(-0.05, 0.82), P(0.06, 0.86)], fill=255, width=int(0.05 * s), joint="curve")
        ell(d, P(-0.02, 0.92), P(0.18, 0.78))
        d.line([P(0.08, 0.86), P(0.48, 0.98)], fill=255, width=int(0.02 * s))
        d.line([P(0.15, 0.80), P(0.32, 0.62), P(0.22, 1.1)], fill=255, width=int(0.04 * s), joint="curve")
        d.line([P(0.22, 1.1), P(0.0, 0.7)], fill=255, width=max(2, int(0.008 * s)))
    return m


def crowd_mask(w, h, rng, top=0.82, hands=10):
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    x = -w * 0.02
    while x < w * 1.02:
        r = rng.uniform(0.022, 0.038) * w
        y = top * h + rng.uniform(-0.02, 0.03) * h
        d.ellipse([x - r * 0.8, y - r, x + r * 0.8, y + r], fill=255)
        d.ellipse([x - r * 2.2, y + r * 0.8, x + r * 2.2, y + r * 5], fill=255)
        x += r * rng.uniform(1.6, 2.6)
    for _ in range(hands):
        hx = rng.uniform(0.05, 0.95) * w
        hy = top * h
        d.line([(hx, hy), (hx + rng.uniform(-0.03, 0.03) * w, hy - rng.uniform(0.07, 0.13) * h)],
               fill=255, width=max(3, int(w * 0.008)))
    d.rectangle([0, int((top + 0.05) * h), w, h], fill=255)
    return m


def camera_mask(w, h, cx, base_y, scale):
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    s = scale * h

    def P(x, y):
        return (cx * w + x * s, base_y * h - y * s)

    lw = max(3, int(0.016 * s))
    head = (0, 0.74)
    for fx in (-0.22, 0.02, 0.24):
        d.line([P(*head), P(fx, 0)], fill=255, width=lw)
    d.line([P(0, 0.74), P(0, 0.80)], fill=255, width=int(lw * 2))
    d.rounded_rectangle([P(-0.13, 0.95)[0], P(-0.13, 0.95)[1], *P(0.11, 0.80)], radius=int(0.02 * s), fill=255)
    d.rectangle([P(-0.07, 0.99), P(0.02, 0.94)], fill=255)
    d.rounded_rectangle([P(0.10, 0.92), P(0.27, 0.83)], radius=int(0.01 * s), fill=255)
    ell(d, P(0.25, 0.93), P(0.30, 0.82))
    return m


def softbox(img, x0, y0, x1, y1, strength=1.0):
    h, w, _ = img.shape
    layer = Image.new("L", (w, h), 0)
    ImageDraw.Draw(layer).rectangle([x0 * w, y0 * h, x1 * w, y1 * h], fill=255)
    core = np.asarray(layer.filter(ImageFilter.GaussianBlur(w * 0.004)), dtype=np.float32) / 255.0
    bloom = np.asarray(layer.filter(ImageFilter.GaussianBlur(w * 0.06)), dtype=np.float32) / 255.0
    img += core[..., None] * IVORY * strength + bloom[..., None] * WARM * 0.45 * strength
    stand = Image.new("L", (w, h), 0)
    sd = ImageDraw.Draw(stand)
    mx = (x0 + x1) / 2 * w
    sd.line([(mx, y1 * h), (mx, h * 0.97)], fill=255, width=max(2, int(w * 0.005)))
    for fx in (-0.05, 0.05):
        sd.line([(mx, h * 0.88), (mx + fx * w, h * 0.98)], fill=255, width=max(2, int(w * 0.004)))
    sm = np.asarray(stand, dtype=np.float32) / 255.0
    img *= (1 - sm * 0.85)[..., None]
    return img


# --------------------------------------------------------------------------- #
# Scenes
# --------------------------------------------------------------------------- #
def scene_dance(w, h, rng, pose=0, cx=0.5, warmth=WARM, wide=False, flip=False):
    img = base(w, h)
    img = cone(img, cx + rng.uniform(-0.03, 0.03), -0.05, rng.uniform(-0.08, 0.08), 0.22, 1.3, warmth, 0.55)
    img = glow(img, cx, 0.86, 0.32 if not wide else 0.18, 0.08, warmth, 0.9)
    img = glow(img, cx, 0.45, 0.6, 0.6, GOLD, 0.08)
    if wide:
        img = cone(img, 0.12, -0.05, 0.35, 0.12, 1.2, AMBER, 0.12)
        img = cone(img, 0.88, -0.05, -0.35, 0.12, 1.2, AMBER, 0.12)
    img = haze(img, rng, 0.12)
    scale = 0.52 if not wide else 0.5
    m = dancer_mask(w, h, cx, 0.9, scale * (h / h), pose=pose, flip=flip)
    img = silhouette(img, m, rim_color=warmth, rim=0.9, rim_offset=(0.5, -1))
    img = glow(img, cx, 0.92, 0.45, 0.04, warmth, 0.25)
    return finish(img, rng)


def scene_portrait(w, h, rng, side="left", tone=WARM, cy=0.42):
    img = base(w, h, top=(0.05, 0.048, 0.045))
    lx = 0.05 if side == "left" else 0.95
    img = glow(img, lx, 0.35, 0.9, 1.1, tone, 0.32, power=1.8)
    img = glow(img, 1 - lx, 0.7, 0.6, 0.6, COOL, 0.05)
    m = portrait_mask(w, h, 0.5 + (0.04 if side == "left" else -0.04), cy, 0.48 * min(1, w / h * 1.25),
                      tilt=0.02 if side == "left" else -0.02)
    img = silhouette(img, m, rim_color=tone, rim=1.1, rim_offset=(1 if side == "left" else -1, -0.3), body=0.02)
    img = haze(img, rng, 0.08)
    return finish(img, rng, vig=0.6)


def scene_event(w, h, rng):
    img = base(w, h, top=(0.06, 0.05, 0.045))
    img = glow(img, 0.5, 0.55, 0.9, 0.6, AMBER, 0.12)
    img = bokeh(img, rng, 90, (0, 0.05, 1, 0.75), 0.008, 0.03, [WARM, AMBER, GOLD, IVORY], 0.5)
    img = string_lights(img, rng, [(0.12, 0.12, 26), (0.26, 0.09, 22)], w, h, 0.7)
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    for (px, sc) in [(0.38, 0.32), (0.55, 0.34)]:
        hx, hy = px * w, (0.93 - sc) * h
        r = 0.045 * sc / 0.33 * h
        d.ellipse([hx - r * 0.85, hy - r, hx + r * 0.85, hy + r], fill=255)
        d.polygon([(hx - r * 2.6, h), (hx - r * 1.8, hy + r * 1.4), (hx + r * 1.8, hy + r * 1.4), (hx + r * 2.6, h)], fill=255)
    d.rectangle([0, int(0.9 * h), w, h], fill=255)
    img = silhouette(img, m, rim_color=WARM, rim=0.55, rim_offset=(0, -1))
    return finish(img, rng)


def scene_celebration(w, h, rng):
    img = base(w, h, top=(0.05, 0.045, 0.04))
    img = bokeh(img, rng, 140, (0, 0, 1, 1), 0.01, 0.045, [WARM, AMBER, EMBER, GOLD], 0.55)
    img = glow(img, 0.5, 0.5, 0.35, 0.45, WARM, 0.25)
    img = haze(img, rng, 0.1)
    return finish(img, rng, vig=0.7)


def scene_concert(w, h, rng, instrument="mic", palette=(AMBER, EMBER)):
    img = base(w, h, top=(0.04, 0.035, 0.035))
    for i, ox in enumerate(np.linspace(0.08, 0.92, 5)):
        c = palette[i % len(palette)]
        img = cone(img, ox, -0.03, (0.5 - ox) * 0.9, 0.07, 1.3, c, 0.35, soft=1.5)
    img = cone(img, 0.5, -0.05, 0, 0.16, 1.2, WARM, 0.45)
    img = haze(img, rng, 0.2)
    img = glow(img, 0.5, 0.72, 0.3, 0.06, WARM, 0.5)
    pm = performer_mask(w, h, 0.5, 0.74, 0.42, instrument)
    img = silhouette(img, pm, rim_color=WARM, rim=0.9, rim_offset=(0.3, -1))
    cm = crowd_mask(w, h, rng, top=0.84, hands=9)
    img = silhouette(img, cm, rim_color=palette[0], rim=0.5, rim_offset=(0, -1))
    return finish(img, rng)


def scene_film(w, h, rng, palette=(AMBER, WARM)):
    img = base(w, h, top=(0.05, 0.05, 0.055), bottom=(0.02, 0.018, 0.016))
    horizon = 0.62
    img = glow(img, 0.36, horizon, 0.5, 0.25, palette[0], 0.55, power=1.6)
    img = glow(img, 0.36, horizon, 0.06, 0.06 * w / h, IVORY, 1.2)
    x, y = grid(w, h)
    flare = np.exp(-((y - horizon) / 0.006) ** 2) * np.clip(1 - np.abs(x - 0.36) * 1.2, 0, 1)
    img += flare[..., None] * np.array([0.55, 0.7, 1.0]) * 0.55
    land = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(land)
    pts = [(0, horizon * h)]
    for i in range(1, 41):
        pts.append((i / 40 * w, (horizon + 0.02 * math.sin(i * 0.7) + rng.uniform(-0.01, 0.01)) * h))
    pts += [(w, h), (0, h)]
    d.polygon(pts, fill=255)
    tx = 0.72 * w
    d.line([(tx, horizon * h), (tx, (horizon - 0.22) * h)], fill=255, width=max(3, int(w * 0.006)))
    for k in range(6):
        r = w * rng.uniform(0.03, 0.05)
        cy = (horizon - 0.22 - rng.uniform(-0.04, 0.05)) * h
        cx2 = tx + rng.uniform(-0.04, 0.04) * w
        d.ellipse([cx2 - r, cy - r * 0.7, cx2 + r, cy + r * 0.7], fill=255)
    fm = (0.6, 0.34)
    hx, hy = fm[0] * w, (horizon - 0.11) * h
    r = 0.016 * h
    d.ellipse([hx - r * 0.8, hy - r, hx + r * 0.8, hy + r], fill=255)
    d.polygon([(hx - r * 1.3, hy + r), (hx + r * 1.3, hy + r), (hx + r, horizon * h), (hx - r, horizon * h)], fill=255)
    img = silhouette(img, land, rim_color=palette[1], rim=0.35, rim_offset=(-0.3, -1))
    img = haze(img, rng, 0.08)
    img = letterbox(img)
    return finish(img, rng, vig=0.45)


def scene_bts(w, h, rng):
    img = base(w, h, top=(0.06, 0.058, 0.055))
    img = softbox(img, 0.08, 0.18, 0.3, 0.52, 1.0)
    img = glow(img, 0.6, 0.95, 0.6, 0.1, WARM, 0.18)
    m = camera_mask(w, h, 0.64, 0.97, 0.7 * min(1, w / h))
    img = silhouette(img, m, rim_color=WARM, rim=0.9, rim_offset=(-1, -0.3))
    img = haze(img, rng, 0.08)
    return finish(img, rng)


def scene_frame(w, h, rng):
    """Behind the scenes: a monitor/viewfinder frame with a dancer inside."""
    inner = scene_dance(int(w * 0.62), int(h * 0.5), np.random.default_rng(int(rng.integers(1 << 30))), pose=2)
    img = base(w, h, top=(0.035, 0.034, 0.033))
    img = glow(img, 0.5, 0.45, 0.7, 0.6, WARM, 0.08)
    ih, iw, _ = inner.shape
    y0, x0 = int(h * 0.2), int(w * 0.19)
    img[y0:y0 + ih, x0:x0 + iw] = inner * 0.95 + 0.02
    pil = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8))
    d = ImageDraw.Draw(pil)
    c = (199, 168, 120)
    t = max(2, w // 400)
    L = w * 0.04
    for (ax, ay, sx, sy) in [(x0, y0, 1, 1), (x0 + iw, y0, -1, 1), (x0, y0 + ih, 1, -1), (x0 + iw, y0 + ih, -1, -1)]:
        d.line([(ax, ay), (ax + sx * L, ay)], fill=c, width=t)
        d.line([(ax, ay), (ax, ay + sy * L)], fill=c, width=t)
    for k in (1, 2):
        d.line([(x0 + iw * k / 3, y0), (x0 + iw * k / 3, y0 + ih)], fill=(120, 110, 95), width=1)
        d.line([(x0, y0 + ih * k / 3), (x0 + iw, y0 + ih * k / 3)], fill=(120, 110, 95), width=1)
    d.ellipse([x0 + iw - 40 * t, y0 - 22 * t, x0 + iw - 34 * t, y0 - 16 * t], fill=(200, 60, 50))
    img = np.asarray(pil, dtype=np.float32) / 255.0
    return finish(img, rng, grain=0.012)


# --------------------------------------------------------------------------- #
# Catalogue: name -> (aspect w/h, scene fn)
# --------------------------------------------------------------------------- #
CATALOGUE = {
    "hero-stage":          (16 / 9, lambda w, h, r: scene_dance(w, h, r, pose=0, cx=0.66, wide=True)),
    "dance-adavu":         (4 / 5, lambda w, h, r: scene_dance(w, h, r, pose=0)),
    "dance-arc":           (3 / 4, lambda w, h, r: scene_dance(w, h, r, pose=1, warmth=AMBER)),
    "dance-arangetram":    (3 / 2, lambda w, h, r: scene_dance(w, h, r, pose=2, wide=True)),
    "dance-solo":          (2 / 3, lambda w, h, r: scene_dance(w, h, r, pose=0, flip=True, warmth=GOLD * 1.25)),
    "event-evening":       (3 / 2, scene_event),
    "event-lights":        (4 / 5, scene_celebration),
    "event-reception":     (16 / 10, lambda w, h, r: scene_event(w, h, r)),
    "portrait-rim":        (4 / 5, lambda w, h, r: scene_portrait(w, h, r, "left")),
    "portrait-window":     (2 / 3, lambda w, h, r: scene_portrait(w, h, r, "right", tone=IVORY * 0.95)),
    "portrait-amber":      (1.0, lambda w, h, r: scene_portrait(w, h, r, "left", tone=AMBER)),
    "music-vocal":         (3 / 2, lambda w, h, r: scene_concert(w, h, r, "mic")),
    "music-violin":        (4 / 5, lambda w, h, r: scene_concert(w, h, r, "mic", palette=(GOLD * 1.3, AMBER))),
    "music-stage":         (16 / 9, lambda w, h, r: scene_concert(w, h, r, "mic", palette=(EMBER, AMBER))),
    "film-horizon":        (16 / 9, scene_film),
    "film-dusk":           (3 / 2, lambda w, h, r: scene_film(w, h, r, palette=(EMBER, AMBER))),
    "bts-studio":          (4 / 5, scene_bts),
    "bts-monitor":         (3 / 2, scene_frame),
    "studio-intro":        (4 / 5, lambda w, h, r: scene_portrait(w, h, r, "right", tone=WARM, cy=0.4)),
    "cta-film":            (21 / 9, lambda w, h, r: scene_film(w, h, r, palette=(AMBER, GOLD))),
}

WIDTHS = [800, 1600]
HERO_WIDTHS = [960, 1600, 2400]


def render(name, aspect, fn, width, seed):
    h = int(round(width / aspect))
    rng = np.random.default_rng(seed)
    arr = fn(width, h, rng)
    return Image.fromarray((arr * 255).astype(np.uint8))


def og_image():
    rng = np.random.default_rng(7)
    arr = scene_dance(1200, 630, rng, pose=0, cx=0.72, wide=True)
    im = Image.fromarray((arr * 255).astype(np.uint8))
    d = ImageDraw.Draw(im)
    try:
        serif = ImageFont.truetype(str(FONTS / "CormorantGaramond-Medium.ttf"), 76)
        ital = ImageFont.truetype(str(FONTS / "CormorantGaramond-Italic.ttf"), 40)
    except OSError:
        serif = ital = ImageFont.load_default()
    d.text((72, 220), "Rule Of Thirds", font=serif, fill=(244, 240, 232))
    d.text((74, 318), "Photography · Film · Storytelling", font=ital, fill=(199, 168, 120))
    d.line([(74, 392), (230, 392)], fill=(199, 168, 120), width=2)
    d.text((74, 410), "Kumaraswamy Layout, Bengaluru", font=ital, fill=(167, 162, 154))
    im.save(ROOT / "public" / "og-image.jpg", quality=86, optimize=True, progressive=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for i, (name, (aspect, fn)) in enumerate(CATALOGUE.items()):
        widths = HERO_WIDTHS if name.startswith("hero") or name.startswith("cta") else WIDTHS
        seed = 1000 + i * 17
        for wdt in widths:
            im = render(name, aspect, fn, wdt, seed)
            im.save(OUT / f"{name}-{wdt}.webp", "WEBP", quality=72, method=6)
        print(f"  {name:20s} {aspect:.3f}  {widths}")
    og_image()
    print("done ->", OUT.relative_to(ROOT))


if __name__ == "__main__":
    main()
