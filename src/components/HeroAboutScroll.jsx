import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Hero from './Hero'
import About from './About'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function HeroAboutScroll() {
  const stageRef = useRef(null)
  const heroWrapperRef = useRef(null)
  const aboutPanelRef = useRef(null)

  // 6 Headline lines refs
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const line3Ref = useRef(null)
  const line4Ref = useRef(null)
  const line5Ref = useRef(null)
  const line6Ref = useRef(null)
  const underlineRef = useRef(null)
  const footerRef = useRef(null)

  // Master Pinned Hero-to-About Timeline
  useGSAP(
    () => {
      if (!stageRef.current) return

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const allLines = [
        line1Ref.current,
        line2Ref.current,
        line3Ref.current,
        line4Ref.current,
        line5Ref.current,
        line6Ref.current,
      ]

      if (prefersReducedMotion) {
        // Reduced motion: position About immediately settled without scrub blur
        gsap.set(aboutPanelRef.current, { yPercent: 0, y: 0 })
        gsap.set(allLines, { filter: 'blur(0px)', opacity: 1, y: 0 })
        gsap.set(underlineRef.current, { opacity: 1, scaleX: 1 })
        gsap.set(footerRef.current, { opacity: 1 })
        return
      }

      // Initialize About panel offscreen below (100% down)
      gsap.set(aboutPanelRef.current, {
        yPercent: 100,
        y: 0,
        force3D: true,
      })

      // Initialize all 6 headline lines in heavily blurred, faded state
      gsap.set(allLines, {
        filter: 'blur(14px)',
        opacity: 0.2,
        y: 22,
        force3D: true,
      })

      // Initialize peach underline hidden
      gsap.set(underlineRef.current, {
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'left center',
      })

      // Create the single master coordinated timeline
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end: '+=2600',
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      })

      // =========================================================
      // PHASE 1 & 2: HERO STAYS PINNED, ABOUT RISES FROM BELOW (0% -> 35%)
      // Hero remains visually stationary behind About.
      // About has solid #1A1A1A background, gradually covering Hero.
      // =========================================================
      masterTl.to(
        aboutPanelRef.current,
        {
          yPercent: 0,
          duration: 3.5,
          ease: 'power1.inOut',
        },
        0
      )

      // Footer subtle cross-fade in as panel covers Hero
      masterTl.fromTo(
        footerRef.current,
        { opacity: 0.3 },
        { opacity: 1, duration: 1.5, ease: 'none' },
        2.0
      )

      // =========================================================
      // PHASE 3: ABOUT TAKES OVER & SETTLES (35% -> 40%)
      // All 6 lines visible in heavily blurred state (approx 14px blur)
      // Visual breathing room / settle pause
      // =========================================================

      // =========================================================
      // PHASE 4: SCROLL-BASED PROGRESSIVE BLUR TEXT REVEAL (40% -> 92%)
      // Line by line, blur reduces to 0px, opacity to 1, y to 0.
      // Previous lines remain sharp while subsequent lines reveal!
      // =========================================================

      // Line 1: "I BUILD DIGITAL EXPERIENCES" (40% -> 52%)
      masterTl.to(
        line1Ref.current,
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        4.0
      )

      // Line 2: "THAT FEEL DIFFERENT." (48% -> 60%)
      masterTl.to(
        line2Ref.current,
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        4.8
      )

      // Peach underline draws in with Line 2
      masterTl.to(
        underlineRef.current,
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.9,
          ease: 'power2.out',
        },
        5.2
      )

      // Line 3: "CRAFTING MODERN, INTERACTIVE" (56% -> 68%)
      masterTl.to(
        line3Ref.current,
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        5.6
      )

      // Line 4: "AND HIGH-PERFORMANCE SYSTEMS" (64% -> 76%)
      masterTl.to(
        line4Ref.current,
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        6.4
      )

      // Line 5: "WHERE INTUITIVE DESIGN MEETS" (72% -> 84%)
      masterTl.to(
        line5Ref.current,
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        7.2
      )

      // Line 6: "SEAMLESS ENGINEERING." (80% -> 92%)
      masterTl.to(
        line6Ref.current,
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        8.0
      )

      // Resting settle cushion (92% -> 100%) before natural pin release
      masterTl.to({}, { duration: 0.8 }, 9.2)

      return () => {
        masterTl.kill()
      }
    },
    { scope: stageRef }
  )

  useEffect(() => {
    // Refresh ScrollTrigger after any assets or layouts finalize
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full overflow-visible">
      {/* Pinned Stage Container (100svh viewport) */}
      <div
        ref={stageRef}
        className="relative w-full h-[100svh] min-h-[580px] overflow-hidden bg-[#1A1A1A] select-none"
        style={{ backgroundColor: '#1A1A1A' }}
      >
        {/* ========================================================= */}
        {/* LAYER 1: HERO (z-index: 10, stationary in background)      */}
        {/* ========================================================= */}
        <div
          ref={heroWrapperRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-auto"
        >
          <Hero />
        </div>

        {/* ========================================================= */}
        {/* LAYER 2: ABOUT SECTION (z-index: 20, rises over Hero)     */}
        {/* Solid #1A1A1A background, covers Hero completely          */}
        {/* ========================================================= */}
        <div
          ref={aboutPanelRef}
          className="absolute inset-0 w-full h-full z-20 pointer-events-auto overflow-hidden border-t border-[#3A3A3A]/80 shadow-[0_-25px_60px_rgba(0,0,0,0.85)]"
          style={{
            backgroundColor: '#1A1A1A',
          }}
        >
          <About
            line1Ref={line1Ref}
            line2Ref={line2Ref}
            line3Ref={line3Ref}
            line4Ref={line4Ref}
            line5Ref={line5Ref}
            line6Ref={line6Ref}
            underlineRef={underlineRef}
            footerRef={footerRef}
          />
        </div>
      </div>
    </div>
  )
}
