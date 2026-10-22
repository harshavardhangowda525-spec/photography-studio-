import { ButtonLink } from '../components/ui/Button'
import { useSeo } from '../lib/useSeo'
import { SplitLines } from '../motion/SplitLines'

const meta = {
  title: 'Page not found | Rule Of Thirds',
  description: 'The page you were looking for could not be found.',
  path: '/404',
  noindex: true,
}

export default function NotFound() {
  useSeo(meta)
  return (
    <section className="studio-light grain flex min-h-[80svh] items-center pb-24 pt-40">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="eyebrow mb-6">404 — Out of frame</p>
        <SplitLines as="h1" immediate lines={['This moment', "wasn't captured."]} italic={[1]} className="text-h2" />
        <p className="mx-auto mt-6 max-w-md text-mute">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <ButtonLink to="/">Back to home</ButtonLink>
          <ButtonLink to="/work" variant="outline">
            View our work
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
