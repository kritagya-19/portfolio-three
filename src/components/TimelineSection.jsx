import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Calendar, Sparkles, Code2, Cpu } from 'lucide-react'
import TimelineWebGLCanvas from './TimelineWebGLCanvas'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const TIMELINE_DATA = [
  {
    year: '2024',
    badge: 'Foundation & Scale',
    role: 'Senior Full-Stack Engineer',
    org: 'Enterprise Platform Architecture',
    description:
      'Architected high-throughput full-stack web applications, resilient backend microservices, and sub-second core web vitals across production platforms.',
    achievements: [
      'Delivered 15+ end-to-end scalable web applications with 99.9% uptime benchmarks.',
      'Reduced initial page bundle payloads by 42% through selective code-splitting and asset pipelines.',
      'Engineered distributed database caching layers with PostgreSQL, Redis, and modern Node.js runtimes.',
    ],
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Redis', 'Web Vitals'],
    icon: Code2,
    stat: '15+ Shipped Platforms',
  },
  {
    year: '2025',
    badge: 'Motion & Design Systems',
    role: 'Lead Interactive Frontend Architect',
    org: 'Design Systems & Kinetic Interfaces',
    description:
      'Pioneered the intersection of editorial typography, kinetic physics choreography, and modular React component frameworks powering high-traffic creative software.',
    achievements: [
      'Won 1st Place at National Web Summit ahead of 120+ competing engineering and product teams.',
      'Architected a production design system and GSAP animation engine maintaining consistent 60fps frame rates.',
      'Recognized for pairing dark editorial aesthetics with responsive, accessible layout engineering.',
    ],
    tags: ['GSAP 3', 'Tailwind CSS', 'Design Systems', 'Micro-Interactions', 'WebGL', 'Framer Motion'],
    icon: Sparkles,
    stat: '1st Place Web Summit',
  },
  {
    year: '2026',
    badge: 'Agentic & Next-Gen Systems',
    role: 'Principal Creative Technologist',
    org: 'Autonomous AI & Spatial Web Engineering',
    description:
      'Engineering next-generation web architectures pairing multi-agent AI workflows, real-time spatial interfaces, and hardware-accelerated WebGL shader pipelines.',
    achievements: [
      'Shipped agentic workflow engines orchestrating real-time AI generation directly within interactive UIs.',
      'Built native WebGL canvas pipelines and shader animations with zero third-party framework overhead.',
      'Leading end-to-end full stack architecture for visionary client launches and venture-backed startups.',
    ],
    tags: ['Autonomous AI', 'React 19', 'Next.js 15', 'Custom Shaders', 'WebGL', 'Cloud Architecture'],
    icon: Cpu,
    stat: 'Next-Gen AI Systems',
  },
]

export default function TimelineSection() {
  const containerRef = useRef(null)
  const lineFillRef = useRef(null)
  const lineTrackRef = useRef(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const milestoneCards = gsap.utils.toArray('.timeline-card')
      const milestoneNodes = gsap.utils.toArray('.timeline-node')

      if (prefersReducedMotion) {
        gsap.set(lineFillRef.current, { scaleY: 1 })
        gsap.set(milestoneCards, { opacity: 1, y: 0 })
        gsap.set(milestoneNodes, { opacity: 1, scale: 1 })
        return
      }

      // Smooth progress line fill tracking user scroll
      gsap.fromTo(
        lineFillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: lineTrackRef.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.5,
          },
        }
      )

      // Milestone cards & node reveal as user scrolls
      milestoneCards.forEach((card, idx) => {
        const node = milestoneNodes[idx]

        // Animate node dot
        if (node) {
          gsap.fromTo(
            node,
            { scale: 0.7, opacity: 0.4 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }

        // Animate card entrance
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            scrollTrigger: {
              trigger: card,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative w-full bg-[#1A1A1A] text-[#F9F9F9] border-t border-[#3A3A3A]/70 py-24 sm:py-32 md:py-36 px-4 sm:px-6 md:px-8 overflow-hidden select-text"
    >
      {/* Hardware-accelerated WebGL Ambient Canvas */}
      <TimelineWebGLCanvas />

      {/* Top & Bottom Cinematic Edge Vignettes */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#1A1A1A] to-transparent pointer-events-none z-1"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1A1A1A] to-transparent pointer-events-none z-1"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#3A3A3A] bg-[#232323] text-[#FDC3A1] text-[11px] sm:text-xs font-inter font-medium tracking-[0.16em] uppercase mb-4 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#FDC3A1]" />
            <span>Journey & Evolution</span>
          </div>

          <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.02em] uppercase text-[#F4E7CD] leading-[0.92]">
            2024 — 2026 Timeline
          </h2>

          <p className="font-inter text-sm sm:text-base md:text-lg text-[#8E8677] mt-4 max-w-xl mx-auto leading-relaxed">
            Three defining years of engineering scalable architectures, mastering kinetic motion systems, and pioneering next-generation intelligent digital products.
          </p>
        </div>

        {/* Timeline Container with Progress Line */}
        <div className="relative w-full">
          {/* Vertical Progress Line Track */}
          <div
            ref={lineTrackRef}
            className="absolute top-2 bottom-6 left-6 md:left-1/2 -translate-x-1/2 w-[2px] bg-[#3A3A3A]/80 pointer-events-none z-10"
          >
            {/* GSAP ScrollTrigger Active Fill */}
            <div
              ref={lineFillRef}
              className="w-full h-full origin-top bg-gradient-to-b from-[#F4E7CD] via-[#FDC3A1] to-[#FDC3A1]"
              style={{
                boxShadow: '0 0 12px rgba(253, 195, 161, 0.45)',
              }}
            />
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-12 sm:space-y-16 md:space-y-24">
            {TIMELINE_DATA.map((item, idx) => {
              const isEven = idx % 2 === 0
              const Icon = item.icon

              return (
                <div
                  key={item.year}
                  className="relative flex flex-col md:flex-row items-start md:items-center w-full"
                >
                  {/* Central Timeline Milestone Node (desktop center, mobile left) */}
                  <div
                    className="timeline-node absolute left-6 md:left-1/2 -translate-x-1/2 -top-1 md:top-auto z-20 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1A1A1A] border-2 border-[#FDC3A1] shadow-[0_0_15px_rgba(253,195,161,0.25)] transition-transform duration-300"
                  >
                    <span className="font-bebas text-xs sm:text-sm text-[#F4E7CD] leading-none pt-0.5">
                      {item.year.slice(2)}
                    </span>
                  </div>

                  {/* Desktop Alternating Spacer */}
                  <div className={`hidden md:block md:w-1/2 ${isEven ? 'order-1 pr-12 lg:pr-16 text-right' : 'order-2 pl-12 lg:pl-16'}`}>
                    <div className="timeline-card group relative bg-[#232323] border border-[#3A3A3A] rounded-2xl p-6 sm:p-7 md:p-8 hover:border-[#FDC3A1]/50 transition-colors duration-300 shadow-xl text-left">
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-inter text-[11px] font-medium tracking-[0.14em] uppercase px-3 py-1 rounded-full bg-[#1A1A1A] text-[#FDC3A1] border border-[#3A3A3A]">
                          {item.badge}
                        </span>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#F4E7CD]" />
                          <span className="font-bebas text-2xl text-[#F4E7CD] tracking-wider">
                            {item.year}
                          </span>
                        </div>
                      </div>

                      {/* Role & Org */}
                      <h3 className="font-inter font-semibold text-lg sm:text-xl text-[#F4E7CD] leading-snug">
                        {item.role}
                      </h3>
                      <p className="font-inter text-xs sm:text-sm text-[#8E8677] mt-0.5 mb-3 font-medium">
                        {item.org}
                      </p>

                      {/* Description */}
                      <p className="font-inter text-xs sm:text-sm text-[#F9F9F9]/85 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Key Highlights */}
                      <ul className="space-y-2 mb-5">
                        {item.achievements.map((ach, aIdx) => (
                          <li
                            key={aIdx}
                            className="font-inter text-xs sm:text-[13px] text-[#F9F9F9]/80 flex items-start gap-2.5 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FDC3A1] shrink-0 mt-1.5" />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#3A3A3A]/60">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-inter text-[10px] sm:text-[11px] text-[#E8DCC2] bg-[#1A1A1A] px-2.5 py-1 rounded-md border border-[#3A3A3A]/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Empty counterpart column for desktop alternating balance */}
                  <div className={`hidden md:block md:w-1/2 ${isEven ? 'order-2 pl-12 lg:pl-16' : 'order-1 pr-12 lg:pr-16 text-right'}`}>
                    <div className="flex flex-col justify-center h-full py-4 px-2">
                      <span className="font-bebas text-5xl sm:text-6xl text-[#3A3A3A] group-hover:text-[#F4E7CD]/20 transition-colors">
                        {item.year}
                      </span>
                      <span className="font-inter text-xs uppercase tracking-[0.18em] text-[#FDC3A1]/80 font-medium">
                        {item.stat}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Single-Column Layout (pl-14 ensures clearance from the left line) */}
                  <div className="block md:hidden w-full pl-14 sm:pl-16">
                    <div className="timeline-card relative bg-[#232323] border border-[#3A3A3A] rounded-xl p-5 sm:p-6 shadow-lg">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-inter text-[10px] font-medium tracking-[0.14em] uppercase px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-[#FDC3A1] border border-[#3A3A3A]">
                          {item.badge}
                        </span>
                        <span className="font-bebas text-xl text-[#F4E7CD]">
                          {item.year}
                        </span>
                      </div>

                      <h3 className="font-inter font-semibold text-base text-[#F4E7CD]">
                        {item.role}
                      </h3>
                      <p className="font-inter text-xs text-[#8E8677] mt-0.5 mb-2.5">
                        {item.org}
                      </p>

                      <p className="font-inter text-xs text-[#F9F9F9]/85 leading-relaxed mb-3">
                        {item.description}
                      </p>

                      <ul className="space-y-1.5 mb-4">
                        {item.achievements.map((ach, aIdx) => (
                          <li
                            key={aIdx}
                            className="font-inter text-[11px] sm:text-xs text-[#F9F9F9]/80 flex items-start gap-2 leading-relaxed"
                          >
                            <span className="w-1 h-1 rounded-full bg-[#FDC3A1] shrink-0 mt-1.5" />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1 pt-2.5 border-t border-[#3A3A3A]/60">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-inter text-[10px] text-[#E8DCC2] bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#3A3A3A]/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

