import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Component as KineticNavigation } from '@/components/ui/sterling-gate-kinetic-navigation'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Hero() {
  const containerRef = useRef(null)
  const portraitRef = useRef(null)
  const taglineRef = useRef(null)

  // Layer 1: Solid Fill (Behind Yash, z-10)
  const solidLayerRef = useRef(null)
  const solidYashRef = useRef(null)
  const solidTrivediRef = useRef(null)

  // Layer 3: Stroke Outline (In front of Yash, z-30)
  const strokeLayerRef = useRef(null)
  const strokeYashRef = useRef(null)
  const strokeTrivediRef = useRef(null)

  // Corner editorial elements
  const topLeftRef = useRef(null)
  const topRightRef = useRef(null)
  const bottomLeftRef = useRef(null)
  const bottomRightRef = useRef(null)
  const replayBtnRef = useRef(null)

  // Replay key, menu open state & completion tracking (plays once per page load)
  const [replayKey, setReplayKey] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const introFinishedRef = useRef(false)

  // Main cinematic animation sequence - runs synchronously on mount (no delay!)
  useGSAP(
    () => {
      if (!containerRef.current) return

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Quick exit for prefers-reduced-motion OR if already completed once (unless replay triggered)
      if (prefersReducedMotion || (introFinishedRef.current && replayKey === 0)) {
        gsap.set(
          [
            portraitRef.current,
            solidLayerRef.current,
            strokeLayerRef.current,
            topLeftRef.current,
            topRightRef.current,
            bottomLeftRef.current,
            bottomRightRef.current,
            solidTrivediRef.current,
            strokeTrivediRef.current,
          ],
          { opacity: 1 }
        )
        gsap.set([solidLayerRef.current, strokeLayerRef.current], {
          xPercent: -50,
          yPercent: -50,
          scaleY: 1.3,
          x: 0,
          y: 0,
        })
        gsap.set([solidYashRef.current, strokeYashRef.current], { x: 0, scale: 1.0 })
        gsap.set([solidTrivediRef.current, strokeTrivediRef.current], { x: 0, opacity: 1 })
        gsap.set(portraitRef.current, { scale: 1.0, opacity: 1, x: 0, y: 0 })
        gsap.set(taglineRef.current, { opacity: 0, display: 'none' })
        gsap.set(strokeYashRef.current, { opacity: 0 })
        gsap.set(['.char-tri', '.char-trivedi', '.char'], { opacity: 1, y: 0, filter: 'blur(0px)' })
        return
      }

      // Initialize base layer positioning & scaleY transform
      gsap.set([solidLayerRef.current, strokeLayerRef.current], {
        xPercent: -50,
        yPercent: -50,
        scaleY: 1.3,
        x: 0,
        y: 0,
      })

      // Reset previous child transforms BEFORE measuring natural resting layout
      gsap.set([solidYashRef.current, strokeYashRef.current], { clearProps: 'transform' })
      gsap.set([solidTrivediRef.current, strokeTrivediRef.current], { clearProps: 'transform' })

      // Calculate the exact horizontal translation needed to center "YASH" during Phase 1
      const strokeYashEl = strokeYashRef.current
      let centerShift = 0
      if (strokeYashEl) {
        const rect = strokeYashEl.getBoundingClientRect()
        const yashCenter = rect.left + rect.width / 2
        const viewportCenter = window.innerWidth / 2
        centerShift = viewportCenter - yashCenter
      }

      const yashLetters = strokeYashEl?.querySelectorAll('.char') || []
      const triLetters = strokeTrivediRef.current?.querySelectorAll('.char-tri') || []
      const trivediSolidLetters = solidTrivediRef.current?.querySelectorAll('.char-trivedi') || []

      // Initial state setups - zero hero flash, centered YASH entrance ready
      gsap.set(taglineRef.current, { opacity: 0, y: -12, display: 'block' })
      // Start YASH oversized and dominant at center
      gsap.set([solidYashRef.current, strokeYashRef.current], { x: centerShift, scale: 1.06 })
      gsap.set([solidTrivediRef.current, strokeTrivediRef.current], { opacity: 0, x: -25 })
      gsap.set(solidLayerRef.current, { opacity: 0 })
      gsap.set(strokeLayerRef.current, { opacity: 1 })
      gsap.set(strokeYashRef.current, { opacity: 1 })
      // Portrait begins ready to fade + settle as one cohesive figure (no bottom-up clip)
      gsap.set(portraitRef.current, {
        opacity: 0,
        scale: 1.06,
        willChange: 'transform, opacity',
      })
      gsap.set([topLeftRef.current, topRightRef.current, bottomLeftRef.current, bottomRightRef.current], {
        opacity: 0,
        y: (i) => (i <= 1 ? -10 : 10),
      })
      gsap.set(replayBtnRef.current, { opacity: 0, y: -8 })

      // Master Cinematic Timeline with CONTINUOUS overlapping motion
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          introFinishedRef.current = true
          gsap.set(portraitRef.current, { clearProps: 'willChange' })
        },
      })

      // =========================================================
      // PHASE 1: IMMEDIATE ENTRANCE (No blank dark pause!)
      // =========================================================
      // Outlined YASH letters reveal immediately at t = 0 with smooth stagger
      tl.fromTo(
        yashLetters,
        {
          opacity: 0,
          y: 28,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.055,
          duration: 0.65,
          ease: 'power3.out',
        },
        0 // Starts immediately on the very first frame!
      )
        // Tagline glides in simultaneously with YASH
        .to(
          taglineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
          },
          0.06
        )

      // =========================================================
      // PHASE 2: CONTINUOUS PORTRAIT REVEAL (Complete subject together)
      // =========================================================
      // Tagline smoothly fades out
      tl.to(
        taglineRef.current,
        {
          opacity: 0,
          y: -14,
          duration: 0.35,
          ease: 'power2.in',
        },
        '+=0.15'
      )
        // Complete portrait (head, hair, face and body) reveals together smoothly
        .to(
          portraitRef.current,
          {
            opacity: 1,
            scale: 1.0,
            duration: 0.95,
            ease: 'power2.out',
          },
          '-=0.25'
        )

      // =========================================================
      // PHASE 3: CONTINUOUS TYPOGRAPHY TRANSFORMATION & HERO GLIDE
      // =========================================================
      // Glides smoothly from center to hero position without waiting
      tl.to(
        [solidYashRef.current, strokeYashRef.current],
        {
          x: 0,
          scale: 1.0,
          duration: 0.9,
          ease: 'power3.inOut',
        },
        '-=0.55'
      )
        // Cross-fade solid cream fill in Layer 1 behind portrait
        .to(
          solidLayerRef.current,
          {
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
          },
          '<0.05'
        )
        // Cross-fade stroke on YASH out so solid cream in Layer 1 is 100% crisp
        .to(
          strokeYashRef.current,
          {
            opacity: 0,
            duration: 0.55,
            ease: 'power2.out',
          },
          '<0.08'
        )
        // Reveal TRIVEDI simultaneously
        .to(
          [solidTrivediRef.current, strokeTrivediRef.current],
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '<0.05'
        )
        .fromTo(
          triLetters,
          {
            opacity: 0,
            y: 20,
            filter: 'blur(4px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.035,
            duration: 0.7,
            ease: 'power3.out',
          },
          '<0.05'
        )
        .fromTo(
          trivediSolidLetters,
          {
            opacity: 0,
            y: 20,
            filter: 'blur(4px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.035,
            duration: 0.7,
            ease: 'power3.out',
          },
          '<0.08'
        )

      // =========================================================
      // PHASE 4: PRECISE HERO SETTLE
      // =========================================================
      tl.to(
        [topLeftRef.current, topRightRef.current, bottomLeftRef.current, bottomRightRef.current],
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.55,
          ease: 'power2.out',
        },
        '-=0.25'
      )

      // =========================================================
      // SCROLL-DRIVEN HERO UPWARD MOTION (Subtle parallax lift)
      // As user scrolls through the hero section, the portrait
      // glides slightly upward while typography floats upward at a
      // gentle differential rate, keeping the website alive and
      // dynamic rather than static.
      // =========================================================
      const isMobile = window.innerWidth < 768
      const portraitTravel = isMobile ? -50 : -85
      const typographyTravel = isMobile ? -24 : -40
      const cornerTravel = isMobile ? -18 : -28

      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      // Portrait floats slightly upward as user scrolls through Hero
      heroScrollTl.to(
        portraitRef.current,
        {
          y: portraitTravel,
          ease: 'none',
        },
        0
      )

      // Solid cream fill and stroke outline text float upward in unison
      heroScrollTl.to(
        [solidLayerRef.current, strokeLayerRef.current],
        {
          y: typographyTravel,
          ease: 'none',
        },
        0
      )

      // Corner metadata gently drifts and softens as hero scrolls past
      heroScrollTl.to(
        [topLeftRef.current, bottomLeftRef.current, bottomRightRef.current],
        {
          y: cornerTravel,
          opacity: 0.35,
          ease: 'none',
        },
        0
      )

      return () => {
        tl.kill()
        heroScrollTl.kill()
      }
    },
    { dependencies: [replayKey], scope: containerRef }
  )

  const triggerReplay = () => {
    introFinishedRef.current = false
    setReplayKey((k) => k + 1)
  }

  return (
    <div
      id="hero"
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[560px] bg-[#1A1A1A] overflow-hidden select-none"
      style={{ backgroundColor: '#1A1A1A' }}
    >
      {/* ========================================================= */}
      {/* EDITORIAL CORNERS (Inter Font, #F4E7CD Cream)              */}
      {/* Initial opacity: 0 prevents any hero flash before loader   */}
      {/* ========================================================= */}

      {/* Top Left: Title (5.86% left, 10.7% top) */}
      <div
        ref={topLeftRef}
        style={{ opacity: 0 }}
        className="absolute top-[10.7%] left-[5.86%] z-40 pointer-events-auto editorial-corner"
      >
        <span className="font-inter text-[#F4E7CD] text-[15px] sm:text-[16px] md:text-[17px] font-normal tracking-[-0.01em]">
          Full Stack Developer
        </span>
      </div>

      {/* Top Right: Kinetic Navigation Bar (Hero-scoped, only visible on Hero section) */}
      <div
        ref={topRightRef}
        style={{ opacity: 0 }}
        className={`absolute top-[9.9%] right-[5.51%] pointer-events-auto editorial-corner transition-[z-index] ${
          isMenuOpen ? 'z-[110]' : 'z-40'
        }`}
      >
        <KineticNavigation onOpenChange={setIsMenuOpen} />
      </div>

      {/* Discreet Replay Button (Reveals on hover below top-left label) */}
      <div
        ref={replayBtnRef}
        style={{ opacity: 0 }}
        className="absolute top-[15.2%] left-[5.86%] z-40 pointer-events-auto opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 editorial-corner"
      >
        <button
          onClick={triggerReplay}
          className="group flex items-center gap-2 font-inter text-xs uppercase tracking-[0.2em] text-[#8E8677] hover:text-[#FDC3A1] transition-colors duration-200 cursor-pointer focus:outline-none bg-[#232323]/80 px-3 py-1.5 rounded-full border border-[#3A3A3A]"
          title="Replay cinematic intro sequence"
          aria-label="Replay loading animation"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8E8677] group-hover:bg-[#FDC3A1] transition-colors duration-200" />
          <span>Replay</span>
        </button>
      </div>

      {/* Bottom Left: Name (5.75% left, 11.0% bottom) */}
      <div
        ref={bottomLeftRef}
        style={{ opacity: 0 }}
        className="absolute bottom-[11.0%] left-[5.75%] z-40 pointer-events-auto editorial-corner"
      >
        <span className="font-inter text-[#F4E7CD] text-[15px] sm:text-[16px] md:text-[17px] font-normal tracking-[-0.01em]">
          Yash Trivedi
        </span>
      </div>

      {/* Bottom Right: Website Link (5.51% right, 11.0% bottom) */}
      <div
        ref={bottomRightRef}
        style={{ opacity: 0 }}
        className="absolute bottom-[11.0%] right-[5.51%] z-40 pointer-events-auto editorial-corner"
      >
        <a
          href="https://www.yashtrivedi.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-inter text-[#F4E7CD] hover:text-[#FDC3A1] transition-colors duration-300 text-[15px] sm:text-[16px] md:text-[17px] font-normal tracking-[-0.01em] underline-offset-4 hover:underline"
        >
          www.yashtrivedi.dev
        </a>
      </div>

      {/* ========================================================= */}
      {/* PHASE 1 TAGLINE                                            */}
      {/* ========================================================= */}
      <div
        ref={taglineRef}
        style={{ opacity: 0 }}
        className="absolute top-[18%] sm:top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none text-center whitespace-nowrap hero-tagline"
      >
        <span className="font-inter text-xs md:text-sm font-medium uppercase tracking-[0.35em] text-[#8E8677]">
          WELCOME TO MY WORLD
        </span>
      </div>

      {/* ========================================================= */}
      {/* LAYER 1: SOLID CREAM FILL BEHIND YASH (z-index: 10)       */}
      {/* ========================================================= */}
      <div
        ref={solidLayerRef}
        className="absolute top-[46.5%] left-1/2 w-full flex items-center justify-center font-bebas text-[#F4E7CD] text-[21.15vw] leading-[0.82] tracking-[0.014em] uppercase select-none z-10 pointer-events-none whitespace-nowrap"
        style={{ opacity: 0, transform: 'translate(-50%, -50%) scale(1, 1.30)' }}
        aria-hidden="true"
      >
        {/* Solid YASH — rendered as individual spans to match Layer 3 exactly (prevents sub-pixel width drift) */}
        <div ref={solidYashRef} className="flex">
          {['Y', 'A', 'S', 'H'].map((char, i) => (
            <span key={i} className="inline-block">{char}</span>
          ))}
        </div>

        {/* Space: exactly 2.81vw matching reference hero.png */}
        <span className="inline-block w-[2.81vw]" />

        {/* Solid TRIVEDI: T, R, I are invisible spacers (hollow in Layer 3); VEDI is solid cream */}
        <div ref={solidTrivediRef} style={{ opacity: 0 }} className="flex">
          <span className="char-trivedi inline-block opacity-0 select-none">T</span>
          <span className="char-trivedi inline-block opacity-0 select-none">R</span>
          <span className="char-trivedi inline-block opacity-0 select-none">I</span>
          {['V', 'E', 'D', 'I'].map((char, i) => (
            <span key={i} className="char-trivedi inline-block">
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* LAYER 2: YASH TRIVEDI PORTRAIT (z-index: 20)              */}
      {/* Sits between solid text behind and outline text in front  */}
      {/* Calibrated positioning and height to match reference hero */}
      {/* ========================================================= */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-end justify-center h-[91.4vh] w-auto max-w-none">
        <div
          ref={portraitRef}
          style={{ opacity: 0 }}
          className="h-full w-auto flex items-end justify-center portrait-subject"
        >
          <img
            src="/yash-potrait.png"
            alt="Yash Trivedi"
            className="w-auto h-full max-w-none object-contain object-bottom pointer-events-none"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* LAYER 3: OUTLINE STROKE IN FRONT OF YASH (z-index: 30)    */}
      {/* ========================================================= */}
      <div
        ref={strokeLayerRef}
        className="absolute top-[46.5%] left-1/2 w-full flex items-center justify-center font-bebas text-[21.15vw] leading-[0.82] tracking-[0.014em] uppercase select-none z-30 pointer-events-none whitespace-nowrap"
        style={{ transform: 'translate(-50%, -50%) scale(1, 1.30)' }}
      >
        {/* Stroke YASH */}
        <div ref={strokeYashRef} className="flex stroke-cream">
          {['Y', 'A', 'S', 'H'].map((char, i) => (
            <span key={i} className="char inline-block" style={{ opacity: 0 }}>
              {char}
            </span>
          ))}
        </div>

        {/* Space: exactly 2.81vw matching reference hero.png */}
        <span className="inline-block w-[2.81vw]" />

        {/* Stroke TRIVEDI: T, R, I are fully hollow outline; VEDI are transparent placeholders */}
        <div ref={strokeTrivediRef} style={{ opacity: 0 }} className="flex">
          <span className="stroke-cream char-tri inline-block">T</span>
          <span className="stroke-cream char-tri inline-block">R</span>
          <span className="stroke-cream char-tri inline-block">I</span>
          {['V', 'E', 'D', 'I'].map((char, i) => (
            <span key={i} className="inline-block opacity-0 select-none">
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* HERO BOTTOM ATMOSPHERIC BLUR TRANSITION                   */}
      {/* Soft feathered gradient + blur into the next section       */}
      {/* ========================================================= */}
      <div
        className="absolute bottom-0 left-0 w-full h-36 sm:h-48 md:h-64 pointer-events-none z-35"
        style={{
          background:
            'linear-gradient(to bottom, rgba(26,26,26,0) 0%, rgba(26,26,26,0.35) 35%, rgba(26,26,26,0.82) 70%, #1A1A1A 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}
