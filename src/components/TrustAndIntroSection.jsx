import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import LogoCloudSwap from '@/components/ui/logo-clouds'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Sub-component to render video or fallback image for project cards
function ProjectCardMedia({ card }) {
  if (card?.video) {
    return (
      <video
        src={card.video}
        poster={card.src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    )
  }

  return (
    <img
      src={card?.src}
      alt={card?.alt}
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      loading="lazy"
    />
  )
}

export default function TrustAndIntroSection({ children }) {
  const containerRef = useRef(null)

  // Technical component ref
  const techSectionRef = useRef(null)

  // Unified stage ref
  const stageWrapperRef = useRef(null)

  // Philosophy component refs
  const philosophyPinnedRef = useRef(null)
  const philosophyPillRef = useRef(null)
  const wordsContainerRef = useRef(null)

  // Achievements transition stage ref (passed via children)
  const achievementsStageRef = useRef(null)

  // Project Gallery ref
  const galleryContainerRef = useRef(null)

  // Structured single-paragraph editorial philosophy statement
  // Balanced line widths (~58-60 chars each) matching line 2, flowing as one cohesive thought.
  const philosophyLines = [
    ["I'm", 'Yash', 'Trivedi,', 'a', 'Full', 'Stack', 'Developer', 'focused', 'on', 'building'],
    ['modern,', 'interactive,', 'and', 'high-performance', 'digital', 'products'],
    ['where', 'design', 'and', 'engineering', 'blend', 'cleanly', 'to', 'craft', 'websites'],
    ['that', 'look', 'distinctive,', 'feel', 'intuitive,', 'and', 'work', 'seamlessly.'],
  ]

  // Six website project cards with live URLs, project names, and preview hero images
  const projectCards = [
    {
      id: 1,
      title: 'Aura Studio',
      url: 'https://github.com',
      src: '/3.png',
      alt: 'Aura Studio Website Project',
    },
    {
      id: 2,
      title: 'Lumina Brand',
      url: 'https://github.com',
      src: '/2.png',
      alt: 'Lumina Brand Website Project',
    },
    {
      id: 3,
      title: 'On Track',
      url: 'https://github.com',
      src: '/1.png',
      alt: 'On Track Website Project',
    },
    {
      id: 4,
      title: 'Verve Spatial',
      url: 'https://github.com',
      src: '/4.png',
      alt: 'Verve Spatial Website Project',
    },
    {
      id: 5,
      title: 'Siren Creative',
      url: 'https://github.com',
      src: '/5.png',
      alt: 'Siren Creative Website Project',
    },
    {
      id: 6,
      title: 'Chronicle Cinema',
      url: 'https://github.com',
      src: '/projects/project-6.jpg',
      video: '/3.mp4',
      alt: 'Chronicle Cinema Website Project',
    },
  ]

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const allWordEls = Array.from(wordsContainerRef.current?.querySelectorAll('.blur-word') || [])
      const cards = galleryContainerRef.current?.querySelectorAll('.gallery-card') || []

      // Split words into ascent (while rising from bottom 85% to top)
      // and pinned (while stationary at top before cards enter) for uniform ~54px/word pacing.
      const ascentCount = Math.min(14, Math.max(1, Math.round(allWordEls.length * 0.34)))
      const ascentWords = allWordEls.slice(0, ascentCount)
      const pinnedWords = allWordEls.slice(ascentCount)

      if (prefersReducedMotion) {
        gsap.set([techSectionRef.current, philosophyPillRef.current, philosophyPinnedRef.current], {
          opacity: 1,
          y: 0,
        })
        gsap.set(allWordEls, { filter: 'blur(0px)', opacity: 1, y: 0 })
        gsap.set(galleryContainerRef.current, { position: 'relative', opacity: 1, y: 0 })
        gsap.set(cards, { opacity: 1, y: 0 })
        if (achievementsStageRef.current) {
          gsap.set(achievementsStageRef.current, { position: 'relative', opacity: 1, y: 0 })
        }
        return
      }

      // Ensure stageWrapperRef is tall enough to display Achievements cleanly after unpinning
      gsap.set(stageWrapperRef.current, {
        minHeight: () => Math.max(window.innerHeight || 900, achievementsStageRef.current?.offsetHeight || 0),
      })

      // =============================================================
      // 1. TECHNICAL SECTION: ALWAYS VISIBLE, SMOOTH UPWARD PARALLAX
      // =============================================================
      gsap.set(techSectionRef.current, { opacity: 1, y: 0 })

      gsap.to(techSectionRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: stageWrapperRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: 0.6,
        },
      })

      // =============================================================
      // INITIAL ELEMENT STATES
      // - Philosophy text starts blurred (14px) and reduced opacity (0.25)
      // - Philosophy container at z-index 10 (background)
      // - Achievements container starts below viewport at window.innerHeight, z-index 25 (middle)
      // - Gallery container starts below viewport at window.innerHeight, z-index 40 (foreground)
      // - Individual cards start hidden until entrance
      // =============================================================
      gsap.set(allWordEls, {
        filter: 'blur(14px)',
        opacity: 0.25,
        y: 4,
        force3D: true,
      })
      gsap.set([philosophyPillRef.current, philosophyPinnedRef.current], {
        opacity: 1,
        y: 0,
      })

      // Enforce strict z-index stacking context: Cards (40) > Achievements (25) > Philosophy (10)
      if (philosophyPinnedRef.current) philosophyPinnedRef.current.style.zIndex = '10'
      if (achievementsStageRef.current) achievementsStageRef.current.style.zIndex = '25'
      if (galleryContainerRef.current) galleryContainerRef.current.style.zIndex = '40'

      // Achievements section starts cleanly below the viewport
      if (achievementsStageRef.current) {
        gsap.set(achievementsStageRef.current, {
          y: () => window.innerHeight || 900,
          opacity: 1,
          force3D: true,
        })
      }

      // Gallery container starts cleanly below the viewport
      gsap.set(galleryContainerRef.current, {
        y: () => window.innerHeight || 900,
        opacity: 1,
        force3D: true,
      })

      // Individual cards start hidden until entrance
      gsap.set(cards, {
        opacity: 0,
        force3D: true,
      })

      // =============================================================
      // SEQUENCE PART 1: PROGRESSIVE WORD-BY-WORD REVEAL ON ASCENT
      // Trigger: when Philosophy top edge reaches 15% above bottom of
      // the viewport ('top 85%').
      // Reveals the first 14 words word-by-word (~54px per word) as
      // Philosophy ascends towards 'top top', so each small scroll
      // reveals ~1-2 words smoothly rather than an entire line.
      // =============================================================
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: stageWrapperRef.current,
          start: 'top 85%',
          end: 'top top',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      const ascentWordDuration = 0.11
      const ascentSpan = Math.max(ascentWords.length - 1, 1)

      ascentWords.forEach((wordEl, idx) => {
        const wordStart = (idx / ascentSpan) * (1 - ascentWordDuration)
        revealTl.to(
          wordEl,
          {
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
            duration: ascentWordDuration,
            ease: 'none',
          },
          wordStart
        )
      })

      // =============================================================
      // SEQUENCE PART 2: PIN PHILOSOPHY AT TOP + WORD-BY-WORD COMPLETION
      // + SIMULTANEOUS CARD ENTRANCE & "work seamlessly." UNBLUR
      //
      // Trigger: when Philosophy reaches top of viewport ('top top').
      // Timeline units map directly to 1000px of scroll (total 5.9 units = 5900px):
      // - 0.00 -> 1.50 (1500px): Remaining words 14..40 (up through "and")
      //   reveal word-by-word (~55px per word, ~1-2 words per scroll) while
      //   Philosophy stays pinned and stationary at the top.
      // - 1.50 -> 5.90 (4400px): Unchanged project card entrance & travel.
      //   1. At t = 1.50, while "work seamlessly." is still blurred, the 6
      //      project cards START moving upward from below the viewport.
      //   2. Simultaneously at t = 1.50, "work seamlessly." progressively unblurs.
      //   3. Cards maintain their exact 4400px travel speed, parallax offsets,
      //      and z-40 layering over Philosophy (z-10) until exiting above top.
      //   4. Pin releases only after the card animation finishes.
      // =============================================================
      const pinnedTextDuration = 1.5
      const cardsDuration = 4.4
      const cardsStartTime = pinnedTextDuration

      const pinnedTl = gsap.timeline({
        scrollTrigger: {
          trigger: stageWrapperRef.current,
          start: 'top top',
          end: '+=5900', // 1500px pinned word reveal + exact 4400px card travel
          pin: true,     // Pins stageWrapperRef with standard pinSpacing: true
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      // Continue smooth word-by-word reveal for words 14..40 while pinned
      const pinnedWordDuration = 0.085
      const pinnedSpan = Math.max(pinnedWords.length - 1, 1)

      pinnedWords.forEach((wordEl, idx) => {
        const wordStart = (idx / pinnedSpan) * (pinnedTextDuration - pinnedWordDuration)
        pinnedTl.to(
          wordEl,
          {
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
            duration: pinnedWordDuration,
            ease: 'none',
          },
          wordStart
        )
      })

      // SIMULTANEOUS ACTION 1: Master gallery upward movement begins at cardsStartTime
      // Continuous, linear scroll-scrubbed ascent across the exact runway
      const card6 = cards[5]

      // Dynamically compute Card 6 metrics & Achievement entrance milestones
      const getCard6Metrics = () => {
        const vpH = window.innerHeight || 900
        const card6TopInGal = card6?.parentElement ? card6.parentElement.offsetTop : 1809
        const card6Height = card6 ? card6.offsetHeight : 497

        // Fixed offset between Card 6 bottom edge and achievementsStageRef top (constant at every scroll step)
        const ACH_GAP = 135
        // Account for Card 6 parallax (+5 at start -> -5 at end, total 10px extra upward travel)
        const targetExitY = -(card6TopInGal + card6Height - 5 + ACH_GAP)
        const startY = vpH
        const totalCard6Travel = startY - targetExitY + 10

        // Milestone 0: Card 6 bottom reaches vpH - ACH_GAP so achievementsStageRef enters at vpH
        // Both Card 6 bottom and achievementsStageRef then travel exactly vpH px in lockstep -> 100% constant gap!
        const pAchStart = Math.max(0.1, Math.min(0.88, (-targetExitY + 10) / totalCard6Travel))

        return {
          targetExitY,
          startY,
          totalTravel: totalCard6Travel,
          pAchStart,
        }
      }

      const initialMetrics = getCard6Metrics()
      const t_achStart = cardsStartTime + cardsDuration * initialMetrics.pAchStart
      const achDuration = Math.max(0.1, cardsStartTime + cardsDuration - t_achStart)

      if (achievementsStageRef.current && stageWrapperRef.current) {
        const achH = achievementsStageRef.current.offsetHeight
        if (achH) {
          stageWrapperRef.current.style.minHeight = `${Math.max(window.innerHeight || 900, achH)}px`
        }
      }

      pinnedTl.fromTo(
        galleryContainerRef.current,
        {
          y: () => window.innerHeight || 900,
        },
        {
          y: () => getCard6Metrics().targetExitY,
          duration: cardsDuration,
          ease: 'none',
        },
        cardsStartTime
      )

      // SIMULTANEOUS ACTION 3: Six cards with distinct parallax speeds & soft entrance fades
      // Parallax offsets give individual cards varied speeds while preserving layout & positions
      const parallaxOffsets = [-36, 26, -20, 22, -30, -10]

      cards.forEach((card, idx) => {
        const offset = parallaxOffsets[idx] || 0

        // Continuous parallax speed variation from cardsStartTime
        pinnedTl.fromTo(
          card,
          { y: -offset * 0.5 },
          {
            y: offset * 0.5,
            duration: cardsDuration,
            ease: 'none',
          },
          cardsStartTime
        )

        // Soft entrance fade as cards rise from below viewport
        pinnedTl.fromTo(
          card,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.44,
            ease: 'power1.out',
          },
          cardsStartTime + idx * 0.088
        )
      })

      // =============================================================
      // SEQUENCE PART 3: PHILOSOPHY EXIT & ACHIEVEMENT TRANSITION
      // 1. As project cards ascend from below (cardsStartTime), Philosophy
      //    smoothly fades out to opacity: 0 so it is completely removed
      //    from the background as the cards enter and scroll through.
      // 2. As Card 6 approaches top of viewport, Achievement (z-25) rises
      //    upward from below (y: innerHeight -> 0), taking over the screen.
      // 3. Pinning releases naturally after transition completes.
      // =============================================================
      pinnedTl.fromTo(
        philosophyPinnedRef.current,
        {
          opacity: 1,
          y: 0,
        },
        {
          opacity: 0,
          y: 0, // VISUALLY STATIONARY — strictly no upward translation!
          duration: 0.45,
          ease: 'power1.out',
        },
        cardsStartTime
      )

      if (achievementsStageRef.current) {
        pinnedTl.fromTo(
          achievementsStageRef.current,
          { y: () => window.innerHeight || 900 },
          {
            y: 0,
            duration: achDuration,
            ease: 'none',
          },
          t_achStart
        )
      }

      return () => {
        revealTl.kill()
        pinnedTl.kill()
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-transparent text-[#F9F9F9] overflow-x-hidden"
    >
      {/* ========================================================= */}
      {/* 1. TECHNICAL COMPONENT (Animated Logo Cloud)               */}
      {/* Crisp, always visible, natural upward scroll movement      */}
      {/* ========================================================= */}
      <div id="tech-stack" ref={techSectionRef} className="relative w-full z-10">
        <LogoCloudSwap
          title="TECH STACK & SKILLS"
          interval={3400}
          className="pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-5 md:pb-6"
        />
      </div>

      {/* ========================================================= */}
      {/* 2. PHILOSOPHY & PROJECT GALLERY UNIFIED STAGE             */}
      {/* Sequence: Enters at top 85% -> Text reveals line-by-line  */}
      {/* -> Pins at top top -> Cards enter and travel beyond top   */}
      {/* ========================================================= */}
      <div
        id="philosophy"
        ref={stageWrapperRef}
        className="relative w-full min-h-screen pt-[7vh] sm:pt-[8.5vh] md:pt-[10vh] pb-20 bg-transparent"
      >
        {/* Philosophy Component (Layered underneath cards: z-10) */}
        <div
          ref={philosophyPinnedRef}
          className="relative w-full max-w-6xl mx-auto left-0 right-0 flex flex-col items-center justify-center text-center px-5 sm:px-8 z-10"
          style={{ zIndex: 10 }}
        >
          {/* Pill Badge */}
          <div ref={philosophyPillRef} className="mb-4 sm:mb-6 md:mb-8">
            <span className="font-inter text-[11px] sm:text-[12px] font-medium tracking-[0.04em] text-[#E8DCC2] px-4 py-1.5 rounded-full border border-[#3A3A3A] bg-[#232323] inline-block shadow-sm">
              Philosophy
            </span>
          </div>

          {/* Philosophy Statement (Single cohesive paragraph, Inter font, sentence-case, cream color) */}
          <h2
            ref={wordsContainerRef}
            className="font-inter font-medium text-[#F4E7CD] text-xl sm:text-2xl md:text-[1.65rem] lg:text-[1.85rem] xl:text-[2.1rem] min-[1400px]:text-[2.25rem]! leading-[1.35] sm:leading-[1.36] tracking-[-0.015em] w-full max-w-6xl mx-auto flex flex-col items-center justify-center gap-y-1 sm:gap-y-1.5 text-center select-text"
            style={{ zIndex: 10 }}
          >
            {philosophyLines.map((line, lineIdx) => (
              <div
                key={lineIdx}
                className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-x-[0.26em] sm:gap-x-[0.3em]"
              >
                {line.map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    className="blur-word inline-block whitespace-nowrap"
                  >
                    {word}
                  </span>
                ))}
              </div>
            ))}
          </h2>
        </div>

        {/* ========================================================= */}
        {/* 3. SIX-IMAGE ASYMMETRICAL PROJECT GALLERY                 */}
        {/* Layered ABOVE Philosophy (z-40) so cards visually overlap */}
        {/* above the Philosophy text as they travel upward           */}
        {/* Strictly NO section heading or title (per requirement)    */}
        {/* ========================================================= */}
        <div
          id="projects"
          ref={galleryContainerRef}
          className="absolute inset-x-0 top-0 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-12 sm:pt-16 md:pt-20 pb-52 z-40 pointer-events-none"
          style={{ zIndex: 40 }}
        >
          {/* Row 1: Card 1 (Left medium) & Card 2 (Right compact, offset) */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-14 lg:gap-16 mb-20 sm:mb-28 md:mb-36 lg:mb-48">
            {/* Card 1: Aura Studio */}
            <a
              href={projectCards[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-card block w-full md:w-[39%] aspect-[4/3.8] rounded-2xl md:rounded-3xl overflow-hidden border border-[#3A3A3A]/70 bg-[#232323] shadow-2xl hover:border-[#FDC3A1]/50 transition-colors duration-500 group pointer-events-auto relative z-40 cursor-pointer"
              style={{ zIndex: 40 }}
            >
              <ProjectCardMedia card={projectCards[0]} />
              {/* Minimal Editorial Hover Overlay: Project Name + Click Indicator */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/55 to-transparent pt-12 pb-4 sm:pb-5 px-4 sm:px-5 md:px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-end justify-between gap-3 pointer-events-none">
                <h3 className="font-bebas text-xl sm:text-2xl md:text-3xl tracking-wide uppercase text-[#F4E7CD] leading-none truncate">
                  {projectCards[0].title}
                </h3>
                <span className="font-inter text-[11px] sm:text-xs font-medium text-[#FDC3A1] inline-flex items-center gap-1 shrink-0 bg-[#1A1A1A]/90 px-2.5 py-1 rounded-full border border-[#3A3A3A] group-hover:border-[#FDC3A1]/40 transition-colors">
                  View Site ↗
                </span>
              </div>
            </a>

            {/* Card 2: Lumina Brand */}
            <a
              href={projectCards[1].url}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-card block w-full md:w-[27%] aspect-[3/3.6] md:mt-12 lg:mt-16 rounded-2xl md:rounded-3xl overflow-hidden border border-[#3A3A3A]/70 bg-[#232323] shadow-2xl hover:border-[#FDC3A1]/50 transition-colors duration-500 group pointer-events-auto relative z-40 cursor-pointer"
              style={{ zIndex: 40 }}
            >
              <ProjectCardMedia card={projectCards[1]} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/55 to-transparent pt-10 pb-3.5 sm:pb-4 px-3.5 sm:px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-end justify-between gap-2 pointer-events-none">
                <h3 className="font-bebas text-lg sm:text-xl md:text-2xl tracking-wide uppercase text-[#F4E7CD] leading-none truncate">
                  {projectCards[1].title}
                </h3>
                <span className="font-inter text-[10px] sm:text-[11px] font-medium text-[#FDC3A1] inline-flex items-center gap-0.5 shrink-0 bg-[#1A1A1A]/90 px-2 py-0.5 rounded-full border border-[#3A3A3A] group-hover:border-[#FDC3A1]/40 transition-colors">
                  View ↗
                </span>
              </div>
            </a>
          </div>

          {/* Row 2: Card 3 (Center focal card / Vertex Platform) */}
          <div className="flex justify-center mb-20 sm:mb-28 md:mb-36 lg:mb-48">
            <a
              href={projectCards[2].url}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-card block w-full md:w-[52%] aspect-[16/11] rounded-2xl md:rounded-3xl overflow-hidden border border-[#3A3A3A]/70 bg-[#232323] shadow-2xl hover:border-[#FDC3A1]/50 transition-colors duration-500 group pointer-events-auto relative z-40 cursor-pointer"
              style={{ zIndex: 40 }}
            >
              <ProjectCardMedia card={projectCards[2]} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/55 to-transparent pt-14 pb-4 sm:pb-5 px-4 sm:px-6 md:px-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-end justify-between gap-3 pointer-events-none">
                <h3 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-wide uppercase text-[#F4E7CD] leading-none truncate">
                  {projectCards[2].title}
                </h3>
                <span className="font-inter text-xs sm:text-sm font-medium text-[#FDC3A1] inline-flex items-center gap-1 shrink-0 bg-[#1A1A1A]/90 px-3 py-1 rounded-full border border-[#3A3A3A] group-hover:border-[#FDC3A1]/40 transition-colors">
                  View Website ↗
                </span>
              </div>
            </a>
          </div>

          {/* Row 3: Card 4 (Left compact) & Card 5 (Right medium) */}
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 md:gap-14 lg:gap-16 mb-20 sm:mb-28 md:mb-36 lg:mb-48">
            {/* Card 4: Verve Spatial */}
            <a
              href={projectCards[3].url}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-card block w-full md:w-[30%] aspect-[4/2.8] rounded-2xl md:rounded-3xl overflow-hidden border border-[#3A3A3A]/70 bg-[#232323] shadow-2xl hover:border-[#FDC3A1]/50 transition-colors duration-500 group pointer-events-auto relative z-40 cursor-pointer"
              style={{ zIndex: 40 }}
            >
              <ProjectCardMedia card={projectCards[3]} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/55 to-transparent pt-10 pb-3.5 sm:pb-4 px-3.5 sm:px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-end justify-between gap-2 pointer-events-none">
                <h3 className="font-bebas text-lg sm:text-xl md:text-2xl tracking-wide uppercase text-[#F4E7CD] leading-none truncate">
                  {projectCards[3].title}
                </h3>
                <span className="font-inter text-[10px] sm:text-[11px] font-medium text-[#FDC3A1] inline-flex items-center gap-0.5 shrink-0 bg-[#1A1A1A]/90 px-2 py-0.5 rounded-full border border-[#3A3A3A] group-hover:border-[#FDC3A1]/40 transition-colors">
                  View ↗
                </span>
              </div>
            </a>

            {/* Card 5: Siren Creative */}
            <a
              href={projectCards[4].url}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-card block w-full md:w-[42%] aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden border border-[#3A3A3A]/70 bg-[#232323] shadow-2xl hover:border-[#FDC3A1]/50 transition-colors duration-500 group pointer-events-auto relative z-40 cursor-pointer"
              style={{ zIndex: 40 }}
            >
              <ProjectCardMedia card={projectCards[4]} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/55 to-transparent pt-12 pb-4 sm:pb-5 px-4 sm:px-5 md:px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-end justify-between gap-3 pointer-events-none">
                <h3 className="font-bebas text-xl sm:text-2xl md:text-3xl tracking-wide uppercase text-[#F4E7CD] leading-none truncate">
                  {projectCards[4].title}
                </h3>
                <span className="font-inter text-[11px] sm:text-xs font-medium text-[#FDC3A1] inline-flex items-center gap-1 shrink-0 bg-[#1A1A1A]/90 px-2.5 py-1 rounded-full border border-[#3A3A3A] group-hover:border-[#FDC3A1]/40 transition-colors">
                  View Site ↗
                </span>
              </div>
            </a>
          </div>

          {/* Row 4: Card 6 (Full-width cinematic banner / Chronicle Cinema) */}
          <div className="w-full md:w-[calc(100%+1.5rem)] md:-mx-3 lg:w-[calc(100%+5rem)] lg:-mx-10">
            <a
              href={projectCards[5].url}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-card block w-full aspect-[18/9] sm:aspect-[2.35/1] rounded-2xl md:rounded-3xl overflow-hidden border border-[#3A3A3A]/70 bg-[#232323] shadow-2xl hover:border-[#FDC3A1]/50 transition-colors duration-500 group pointer-events-auto relative z-40 cursor-pointer"
              style={{ zIndex: 40 }}
            >
              <ProjectCardMedia card={projectCards[5]} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/55 to-transparent pt-16 pb-5 sm:pb-6 px-5 sm:px-7 md:px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-end justify-between gap-4 pointer-events-none">
                <h3 className="font-bebas text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase text-[#F4E7CD] leading-none truncate">
                  {projectCards[5].title}
                </h3>
                <span className="font-inter text-xs sm:text-sm font-medium text-[#FDC3A1] inline-flex items-center gap-1.5 shrink-0 bg-[#1A1A1A]/90 px-3.5 py-1.5 rounded-full border border-[#3A3A3A] group-hover:border-[#FDC3A1]/40 transition-colors">
                  View Website ↗
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. ACHIEVEMENTS SECTION (Layered z-25 underneath cards)   */}
        {/* Rises from below as Card 6 enters, taking over viewport   */}
        {/* ========================================================= */}
        {children && (
          <div
            ref={achievementsStageRef}
            className="absolute inset-x-0 top-0 w-full z-25 pointer-events-auto"
            style={{ zIndex: 25 }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
