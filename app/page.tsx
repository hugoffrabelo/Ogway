import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Benefits } from '@/components/benefits'
import { HowItWorks } from '@/components/how-it-works'
import { WhyDifferent } from '@/components/why-different'
import { Trust } from '@/components/trust'
import { About } from '@/components/about'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <WhyDifferent />
        <Trust />
        <About />
        <Contact />
      </main>
      <SiteFooter />
      <div className="grain-overlay" aria-hidden="true" />
    </div>
  )
}
