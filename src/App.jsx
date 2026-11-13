import Hero from './components/Hero'
import TrustAndIntroSection from './components/TrustAndIntroSection'
import AchievementsGallery from '@/components/ui/image-gallery'
import TimelineSection from './components/TimelineSection'
import PremiumCtaSection from './components/PremiumCtaSection'
import BeamWordmarkFooter from '@/components/ui/beam-wordmark-footer'

export default function App() {
  return (
    <main className="w-full min-h-screen bg-[#1A1A1A] text-[#F9F9F9] overflow-x-hidden selection:bg-[#FDC3A1] selection:text-[#1A1A1A]">
      <Hero />
      <TrustAndIntroSection>
        <AchievementsGallery />
      </TrustAndIntroSection>
      <TimelineSection />
      <PremiumCtaSection />
      <BeamWordmarkFooter />
    </main>
  )
}
