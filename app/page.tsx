import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Benefits } from '@/components/benefits'
import { Services } from '@/components/services'
import { HowItWorks } from '@/components/how-it-works'
import { WhyDifferent } from '@/components/why-different'
import { Pillars } from '@/components/pillars'
import { About } from '@/components/about'
import { Faq } from '@/components/faq'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'
import { PERGUNTAS } from '@/components/faq'
import { jsonLd, schemaEmpresa, schemaFaq, schemaPessoa, schemaSite } from '@/lib/seo'

export default function Page() {
  return (
    <div className="min-h-svh bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([schemaSite(), schemaEmpresa(), schemaPessoa(), schemaFaq(PERGUNTAS)]),
        }}
      />
      <SiteHeader />
      <main>
        <Hero />
        <Benefits />
        <Services />
        <HowItWorks />
        <WhyDifferent />
        <Pillars />
        <About />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  )
}
