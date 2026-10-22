# Rule Of Thirds — Studio Website

A cinematic, editorial website proposal for **Rule Of Thirds**, a photography and videography studio in Kumaraswamy Layout, Bengaluru. Built as a demo for the client.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion for React · React Router · Lucide icons
Fonts are self-hosted (Cormorant Garamond + Manrope via Fontsource), so there are no third-party font requests.

```bash
npm install
npm run dev        # local development at http://localhost:5173
npm run build      # type-check, production build, per-route HTML in dist/
npm run preview    # serve the production build
```

Requires Node 20.19+ or 22.12+.

---

## Pages

| Route      | Contents |
|------------|----------|
| `/`        | Hero, studio intro, featured work + lightbox, services, the experience timeline, testimonials, philosophy, final CTA |
| `/work`    | Filterable masonry portfolio, full-screen lightbox, films section with a video player |
| `/contact` | Enquiry form delivered via WhatsApp, call and WhatsApp shortcuts, address, directions, business hours |

Portfolio filters and the open image are kept in the URL, so links can be shared, for example `/work?category=dance&item=dance-arangetram`.

---

## ⚠️ Before going live: what must be replaced or confirmed

### 1. Photography (required)
**All images are generated placeholders.** They're moody stage-light compositions made by `scripts/generate-placeholders.py`, and the site labels each one **"Placeholder image"**. None of them is presented as studio work.

To add the studio's real photographs:

1. Export WebP (or AVIF/JPEG) files at about 1600 px on the long edge. For the hero and final CTA, also export 2400 px and 960 px versions.
2. Put them in `public/images/work/` (or any folder under `public/`).
3. Edit the content files:
   - **Portfolio:** `src/content/portfolio.ts`. Each entry has an `image`, `alt`, `title`, `category` and an optional `caption` and `video`.
     ```ts
     image: { src: '/images/work/arangetram-01.webp', width: 1600, height: 1067 },
     ```
     Omitting `placeholder` hides the "Placeholder image" tag. Add a `srcSet` for responsive sizes if you export several widths.
   - **Hero, intro, about, CTA and contact images:** `src/config/media.ts`
   - **Service photos:** `src/content/site.ts` (`services[].image`)
   - If you change the hero image, update the hero `<link rel="preload">` in `index.html` to match.
4. Delete the remaining placeholder entries and the `public/images/placeholders/` folder.
5. Remove the placeholder notice paragraph near the top of `src/pages/Work.tsx`.

**Films:** add `video: [{ src: '/media/film.webm', type: 'video/webm' }, { src: '/media/film.mp4', type: 'video/mp4' }]` to a portfolio item. The item's image becomes the poster. Videos never autoplay and start muted on the Work page. Keep files web-optimised (H.264 MP4 or VP9 WebM, about 5–15 MB). For long films, link to YouTube or Vimeo instead.

### 2. Business details: `src/config/business.ts`
Everything shown on the site comes from this one file: name, phone, WhatsApp number, address and hours note.

- **`reviewsUrl`** is currently `null`, so "Read customer reviews" opens a Google Maps search for the studio. Paste the studio's verified Google Business Profile link here once it's confirmed.
- **`socials`** is empty on purpose. Add the official Instagram or YouTube links here once they're confirmed, and they'll appear in the footer.
- **Hours:** only "open until 11:30 PM" was supplied, so the site shows exactly that and asks visitors to confirm timings. Add the full weekly schedule here when the studio confirms it. Only then should `openingHoursSpecification` be added to the JSON-LD in `index.html`.

### 3. Testimonials: `src/content/site.ts`
The three testimonials are **adapted (paraphrased) wording** from the customer feedback supplied for this project, and a note on the page says so. If you replace them with exact Google review text, paste it word for word, keep the reviewer's name, and update the note in `src/components/home/Testimonials.tsx`. The 5.0 rating and 52-review count come from the supplied business information, so update them when they change. No review or rating structured data is emitted, in line with Google's self-serving review guidelines.

### 4. Service list
The six services (plus the enquiry-form options in `enquiryTypes`) are the **proposed** categories. Confirm them with the studio. No prices are shown anywhere.

---

## Contact form (WhatsApp only, no backend)

The form needs **no server, no API keys and no third-party form service**:

1. It checks the fields in the browser: name, phone (Indian or international format), service type, a future event date and location are required. Email is optional but must be valid if given.
2. It builds a message with all the details and opens `https://wa.me/918549888399?text=…` in a new tab or the WhatsApp app.
3. The confirmation says **"Your message is ready in WhatsApp. Press Send…"**. The website can't know whether the visitor actually sent it, so it never claims the enquiry was received.
4. If the browser blocks the new window, an error explains this and offers a direct WhatsApp link and a phone link.
5. The submit button is disabled for a few seconds after sending, to prevent duplicate enquiries.

Nothing is stored on the site. If the studio later wants email delivery or a CRM as well, add a serverless function (for example Netlify or Vercel functions with Resend) and keep any API key in the host's environment variables, never in frontend code.

---

## SEO & local discovery

- Each route has its own title, description, canonical URL (`https://ruleofthirds.in/...`), Open Graph and Twitter tags. They're defined in `src/config/seo.json`, applied at runtime by `useSeo()`, and written into static HTML at build time by `scripts/prerender-meta.mjs`. That produces `dist/work/index.html`, `dist/contact/index.html` and `dist/404.html`.
- `LocalBusiness` JSON-LD in `index.html` uses **only verified details**: name, phone, address, URL and areaServed. No rating, hours or price range.
- `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt` and `public/og-image.jpg` (1200×630).
- Semantic landmarks, one `h1` per page, and descriptive alt text on every image.

> The site **has not been deployed to ruleofthirds.in**. Canonical URLs assume that domain. If the final domain differs (for example `www.`), update `siteUrl` in `src/config/seo.json`, `index.html`, `public/sitemap.xml`, `public/robots.txt` and `public/llms.txt`.

## Deployment

The build output is a static folder (`dist/`). It works on any static host:

- **Netlify:** build command `npm run build`, publish directory `dist`. `public/_redirects` (404 fallback) and `public/_headers` (long-term caching) are included.
- **Vercel:** framework "Vite". `vercel.json` sets clean URLs and cache headers.
- **Other hosts:** serve `dist/`, map `/work` → `work/index.html` and `/contact` → `contact/index.html`, use `404.html` for unknown paths, and enable gzip or brotli.

After deploying, submit the sitemap in Google Search Console and link the site from the Google Business Profile.

---

## Project structure

```
src/
  config/      business.ts (contact details) · media.ts (site imagery) · navigation.ts · seo.json
  content/     portfolio.ts (gallery data) · site.ts (services, steps, testimonials, principles)
  components/  layout/ (Navigation, Footer, Layout) · home/ (one file per section)
               portfolio/ (PortfolioTile, Lightbox) · contact/ (ContactForm) · ui/ (Button, images, links)
  motion/      presets.ts (easing + variants) · Reveal.tsx · SplitLines.tsx (line-by-line headline reveal)
  lib/         enquiry.ts (validation + WhatsApp message) · image.ts · useSeo.ts · useScrolled.ts
  pages/       Home · Work · Contact · NotFound
  styles/      index.css (design tokens, film grain, paper texture, studio light, frames)
scripts/       generate-placeholders.py · prerender-meta.mjs
```

### Motion & accessibility
- One consistent motion system: a cinematic ease-out curve, line-mask headline reveals, scroll-triggered reveals, gentle parallax, a cross-fading page transition, and a short (~0.65 s) opening curtain on the first visit only.
- `prefers-reduced-motion` is respected throughout. Motion falls back to fades, CSS loops and smooth scrolling are disabled, and the opening curtain is skipped.
- Keyboard: a skip link, visible focus states, a focus-trapped mobile menu and lightbox (Esc closes, ←/→ navigate, focus is returned when closed), and swipe gestures in the lightbox on touch devices.

### Measured results (local production build, Lighthouse)
| Page | Mobile perf | Desktop perf | Accessibility | Best practices | SEO |
|------|------|------|------|------|------|
| Home | 91 | 100 | 100 | 100 | 100 |
| Work | 91 | 100 | 100 | 100 | 100 |
| Contact | 89 | 99 | 100 | 100 | 100 |

These were measured with `vite preview` on a local machine using Lighthouse's simulated mobile throttling. Re-measure on the live host. Mobile first paint is limited mainly by the JavaScript bundle (about 157 kB gzipped), because the page is rendered on the client.
