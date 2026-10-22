import { About } from '../components/home/About'
import { Experience } from '../components/home/Experience'
import { FeaturedPortfolio } from '../components/home/FeaturedPortfolio'
import { FinalCTA } from '../components/home/FinalCTA'
import { Hero } from '../components/home/Hero'
import { Services } from '../components/home/Services'
import { StudioIntro } from '../components/home/StudioIntro'
import { Testimonials } from '../components/home/Testimonials'
import { useSeo } from '../lib/useSeo'

export default function Home() {
  useSeo('/')
  return (
    <>
      <Hero />
      <StudioIntro />
      <FeaturedPortfolio />
      <Services />
      <Experience />
      <Testimonials />
      <About />
      <FinalCTA />
    </>
  )
}
