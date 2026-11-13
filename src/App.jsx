import Hero from './components/Hero'
import StoriesSection from './components/StoriesSection'
import TrustAndIntroSection from './components/TrustAndIntroSection'
import AchievementsGallery from '@/components/ui/image-gallery'
import TimelineSection from './components/TimelineSection'
import PremiumCtaSection from './components/PremiumCtaSection'
import BeamWordmarkFooter from '@/components/ui/beam-wordmark-footer'
import { RetroGrid } from '@/components/ui/retro-grid'

export default function App() {
  return (
    <div className="relative w-full min-h-screen bg-[#1A1A1A] text-[#F9F9F9] overflow-x-hidden selection:bg-[#FDC3A1] selection:text-[#1A1A1A]">
      {/* Single global RetroGrid visible across every section */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <RetroGrid />
      </div>

      <main className="relative z-10 w-full">
        <Hero>
          {({ revealed }) => <StoriesSection revealed={revealed} />}
        </Hero>
        <TrustAndIntroSection>
          <AchievementsGallery />
        </TrustAndIntroSection>
        <TimelineSection />
        <PremiumCtaSection />
        <BeamWordmarkFooter />
      </main>
    </div>
  )
}
