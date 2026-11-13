import { useState } from 'react'
import { ArrowUpRight, Copy, Check, Clock, Mail, Calendar, Sparkles } from 'lucide-react'

export default function PremiumCtaSection() {
  const [copied, setCopied] = useState(false)
  const EMAIL = 'yash@yashtrivedi.dev'

  const handleCopyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL)
        setCopied(true)
        setTimeout(() => setCopied(false), 2400)
      }
    } catch {
      // Fallback
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    }
  }

  const handleProjectsClick = (e) => {
    const target = document.querySelector('#projects')
    if (target) {
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#1A1A1A] border-t border-[#3A3A3A]/70 py-24 sm:py-32 md:py-36 px-4 sm:px-6 md:px-8 select-text"
    >
      {/* Full-Screen Looping Cinematic Video Backdrop */}
      <video
        src="/cta.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-40 md:opacity-45"
      />

      {/* Dark Charcoal Scrim & Edge Vignettes for Strict Contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-[#1A1A1A]/85 to-[#1A1A1A] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#1A1A1A] to-transparent pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1A1A1A] to-transparent pointer-events-none"
      />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Live Availability Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#3A3A3A] bg-[#232323]/90 text-[#FDC3A1] text-xs font-inter font-medium tracking-[0.12em] uppercase mb-6 sm:mb-8 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FDC3A1] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FDC3A1]" />
          </span>
          <span>Available for Select Q1/Q2 2026 Projects</span>
        </div>

        {/* Oversized Display Headline */}
        <h2 className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] tracking-[0.02em] uppercase text-[#F4E7CD] leading-[0.9] max-w-4xl">
          Let&apos;s Build Something Extraordinary
        </h2>

        {/* Supporting Editorial Body Copy */}
        <p className="font-inter text-sm sm:text-base md:text-lg text-[#F9F9F9]/85 max-w-2xl mt-5 sm:mt-6 leading-relaxed">
          Whether you need a visionary full-stack architect, a production-grade kinetic motion system, or a high-craft web platform that sets your product apart — let&apos;s turn your vision into fast, resilient software.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 w-full">
          {/* Main CTA: Start a Conversation */}
          <a
            href="https://www.yashtrivedi.dev"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3.5 px-7 py-4 rounded-full bg-[#FDC3A1] text-[#1A1A1A] font-inter text-sm font-semibold tracking-wide uppercase hover:bg-[#F4E7CD] transition-colors duration-300 shadow-xl"
          >
            <span>Start a Conversation</span>
            <span className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#F9F9F9] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </a>

          {/* Secondary CTA: View Selected Work */}
          <a
            href="#projects"
            onClick={handleProjectsClick}
            className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full bg-[#232323] text-[#F4E7CD] border border-[#3A3A3A] hover:border-[#FDC3A1]/60 font-inter text-sm font-medium tracking-wide uppercase transition-colors duration-300"
          >
            <span>Explore Projects</span>
            <Sparkles className="w-4 h-4 text-[#FDC3A1]" />
          </a>
        </div>

        {/* Premium Interactive Contact Grid */}
        <div className="mt-12 sm:mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {/* Card 1: Direct Email with 1-Click Copy */}
          <div className="group relative bg-[#232323]/90 border border-[#3A3A3A] rounded-2xl p-5 sm:p-6 hover:border-[#FDC3A1]/50 transition-colors duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="font-inter text-[11px] font-medium tracking-[0.14em] uppercase text-[#8E8677] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FDC3A1]" />
                Direct Email
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy email address"
                className="p-1.5 rounded-md bg-[#1A1A1A] border border-[#3A3A3A] text-[#F4E7CD] hover:text-[#FDC3A1] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#FDC3A1]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="font-inter font-medium text-sm sm:text-[15px] text-[#F4E7CD] truncate">
              {EMAIL}
            </p>
            <p className="font-inter text-[11px] text-[#8E8677] mt-1">
              {copied ? '✓ Copied to clipboard!' : 'Click the button to copy'}
            </p>
          </div>

          {/* Card 2: Response Time Commitment */}
          <div className="relative bg-[#232323]/90 border border-[#3A3A3A] rounded-2xl p-5 sm:p-6 hover:border-[#FDC3A1]/50 transition-colors duration-300">
            <div className="flex items-center gap-1.5 mb-3">
              <Clock className="w-3.5 h-3.5 text-[#FDC3A1]" />
              <span className="font-inter text-[11px] font-medium tracking-[0.14em] uppercase text-[#8E8677]">
                Rapid Response
              </span>
            </div>
            <p className="font-inter font-medium text-sm sm:text-[15px] text-[#F4E7CD]">
              Replies within 12 Hours
            </p>
            <p className="font-inter text-[11px] text-[#8E8677] mt-1">
              Direct founder & engineer communication
            </p>
          </div>

          {/* Card 3: Intro Call & Scheduling */}
          <div className="relative bg-[#232323]/90 border border-[#3A3A3A] rounded-2xl p-5 sm:p-6 hover:border-[#FDC3A1]/50 transition-colors duration-300">
            <div className="flex items-center gap-1.5 mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#FDC3A1]" />
              <span className="font-inter text-[11px] font-medium tracking-[0.14em] uppercase text-[#8E8677]">
                Intro Call
              </span>
            </div>
            <a
              href="https://www.yashtrivedi.dev"
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex items-center gap-1.5 font-inter font-medium text-sm sm:text-[15px] text-[#F4E7CD] hover:text-[#FDC3A1] transition-colors"
            >
              <span>Schedule 15-Min Briefing</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
            <p className="font-inter text-[11px] text-[#8E8677] mt-1">
              Discuss architecture, scope & timeline
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

