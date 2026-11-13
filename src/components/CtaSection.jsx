import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#1A1A1A] border-t border-[#3A3A3A]/70"
    >
      {/* Full-Screen Looping Background Video (un-cropped) */}
      <video
        src="/cta.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="w-full h-full max-h-screen object-contain object-center pointer-events-none"
      />

      {/* Subtle Edge Fades & Bottom Readability Scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#1A1A1A] to-transparent pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-72 sm:h-80 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/40 to-transparent pointer-events-none"
      />

      {/* Full-Width Bottom Editorial Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 w-full px-5 sm:px-8 md:px-10 lg:px-12 pb-6 sm:pb-8 md:pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        {/* Bottom-Left: Giant Display Wordmark */}
        <div className="flex items-start select-none shrink-0">
          <h2 className="font-bebas text-[28vw] sm:text-[24vw] md:text-[21vw] lg:text-[22vw] uppercase tracking-[0.015em] text-[#F4E7CD] leading-[0.76]">
            Yash
          </h2>
          <span
            aria-hidden="true"
            className="font-bebas text-[12vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[9vw] text-[#F4E7CD] leading-none ml-1 sm:ml-2 -mt-1 sm:-mt-2"
          >
            *
          </span>
        </div>

        {/* Bottom-Right: Editorial Bio & Pill CTA */}
        <div className="w-full md:max-w-[340px] lg:max-w-[380px] flex flex-col items-start gap-4 sm:gap-5 md:pb-2">
          <p className="font-inter text-xs sm:text-sm text-[#F9F9F9]/90 leading-relaxed">
            A full stack developer who builds clean, scalable and human centered digital experiences through code, design and technology.
          </p>

          <a
            href="https://www.yashtrivedi.dev"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-4 rounded-full bg-[#FDC3A1] text-[#1A1A1A] pl-5 pr-1.5 py-1.5 font-inter text-xs sm:text-sm font-medium hover:bg-[#F4E7CD] transition-colors duration-300"
          >
            <span>Get in touch</span>
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A1A1A] text-[#F9F9F9] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
