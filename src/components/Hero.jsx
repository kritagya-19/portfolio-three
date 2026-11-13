import { useRef, useState, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Component as KineticNavigation } from '@/components/ui/sterling-gate-kinetic-navigation'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// #region Organic Torn Paper Math & Paths
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function tearLine(seed = 11, from = -800, to = 1800, step = 9, cx = 500, cy = 318, angle = -7) {
  const r = rng(seed)
  const slope = Math.tan((angle * Math.PI) / 180)
  const out = []
  for (let x = from; x <= to; x += step) {
    const fibre = (r() - 0.5) * 5
    const tooth = r() < 0.09 ? (r() - 0.5) * 26 : 0
    const wander = Math.sin(x * 0.019 + seed) * 10 + Math.sin(x * 0.053 + seed * 2) * 4
    out.push([x, cy + (x - cx) * slope + wander + fibre + tooth])
  }
  return out
}

function fibreWidths(n, seed = 5) {
  const r = rng(seed)
  return Array.from({ length: n }, (_, i) => 2.5 + 6 * (0.5 + 0.5 * Math.sin(i * 0.37 + seed)) * (0.6 + r() * 0.8))
}

const VIEW_W = 1000
const VIEW_H = 636
const CX = 500
const FAR = 4000

const d = (pts, close = true) =>
  'M' + pts.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join('L') + (close ? 'Z' : '')

const CURLS = {
  top: [
    [300, 44, 30],
    [575, 30, 20],
    [790, 52, 34],
  ],
  bottom: [
    [205, 50, 32],
    [470, 34, 22],
    [690, 40, 28],
  ],
}
// #endregion

export default function Hero() {
  const pinContainerRef = useRef(null)
  const stageRef = useRef(null)
  const portraitRef = useRef(null)

  // Layer 1: Solid Cream Typography "YASH TRIVEDI" (Behind character, z-10)
  const solidLayerRef = useRef(null)
  const solidYashRef = useRef(null)
  const solidTrivediRef = useRef(null)
  const gapRef = useRef(null)

  // Corner editorial elements
  const topLeftRef = useRef(null)
  const topRightRef = useRef(null)
  const bottomLeftRef = useRef(null)
  const bottomRightRef = useRef(null)

  // Loading Screen Torn-Paper Overlay Refs (z-30)
  const paperOverlayRef = useRef(null)
  const uncutPosterRef = useRef(null)
  const splitHalvesRef = useRef(null)
  const topHalfRef = useRef(null)
  const bottomHalfRef = useRef(null)
  const crackPathRef = useRef(null)
  const scrollHintRef = useRef(null)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Generate deterministic torn edges once
  const line = useMemo(() => tearLine(), [])
  const crackLine = useMemo(() => line.filter(([x]) => x >= -100 && x <= 1100), [line])

  // Top and bottom half geometry
  const topShape = useMemo(
    () => [[line[0][0], -FAR], [line[line.length - 1][0], -FAR], ...[...line].reverse()],
    [line]
  )
  const bottomShape = useMemo(
    () => [...line, [line[line.length - 1][0], FAR], [line[0][0], FAR]],
    [line]
  )

  const topCore = useMemo(() => {
    const widths = fibreWidths(line.length, 5)
    return line.concat(line.map(([x, y], i) => [x, y - widths[i]]).reverse())
  }, [line])

  const bottomCore = useMemo(() => {
    const widths = fibreWidths(line.length, 8)
    return line.concat(line.map(([x, y], i) => [x, y + widths[i]]).reverse())
  }, [line])

  const topCurls = useMemo(() => {
    return CURLS.top.map(([cx, hw, depth]) => {
      const pts = line.filter(([x]) => Math.abs(x - cx) <= hw)
      const back = pts.map(([x, y]) => {
        const s = Math.cos(((x - cx) / hw) * (Math.PI / 2))
        return [x + 6 * s, y + depth * s * s]
      })
      return d(pts.concat(back.reverse()))
    })
  }, [line])

  const bottomCurls = useMemo(() => {
    return CURLS.bottom.map(([cx, hw, depth]) => {
      const pts = line.filter(([x]) => Math.abs(x - cx) <= hw)
      const back = pts.map(([x, y]) => {
        const s = Math.cos(((x - cx) / hw) * (Math.PI / 2))
        return [x - 6 * s, y - depth * s * s]
      })
      return d(pts.concat(back.reverse()))
    })
  }, [line])

  // GSAP PINNED SCROLL TIMELINE: Fixed Loading Screen to Full Hero Reveal
  useGSAP(
    () => {
      if (!pinContainerRef.current) return

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        gsap.set(paperOverlayRef.current, { display: 'none' })
        gsap.set(
          [
            portraitRef.current,
            solidLayerRef.current,
            topLeftRef.current,
            topRightRef.current,
            bottomLeftRef.current,
            bottomRightRef.current,
            solidYashRef.current,
            solidTrivediRef.current,
          ],
          { opacity: 1, filter: 'blur(0px)' }
        )
        gsap.set(solidLayerRef.current, {
          xPercent: -50,
          yPercent: -50,
          scaleY: 1.25,
          scaleX: 1.0,
          x: 0,
          y: 0,
        })
        gsap.set([solidYashRef.current, solidTrivediRef.current], { x: 0 })
        gsap.set(portraitRef.current, { scale: 1.0, opacity: 1, x: 0, y: 0 })
        return
      }

      // Initial clean poster: completely solid, zero dividing line
      gsap.set(paperOverlayRef.current, { opacity: 1, display: 'block', pointerEvents: 'none' })
      gsap.set(uncutPosterRef.current, { display: 'block', opacity: 1 })
      gsap.set(splitHalvesRef.current, { display: 'none' })

      // Calculate crack line length for drawing on scroll
      const crackLen = crackPathRef.current?.getTotalLength?.() || 1400
      gsap.set(crackPathRef.current, {
        strokeDasharray: crackLen,
        strokeDashoffset: crackLen,
        opacity: 0,
      })

      // Paper halves starting positions (ready for split hand-off)
      gsap.set([topHalfRef.current, bottomHalfRef.current], {
        x: 0,
        y: 0,
        rotation: 0,
        transformOrigin: '500px 318px',
      })

      // Portrait sits in foreground (z-20)
      gsap.set(portraitRef.current, {
        opacity: 1,
        scale: 1.0,
        y: 0,
      })

      // "YASH TRIVEDI" typography starts completely hidden behind character
      // It animates in smoothly AFTER the loading screen has completely opened
      const yashLetters = solidYashRef.current?.querySelectorAll('.char') || []
      const trivediLetters = solidTrivediRef.current?.querySelectorAll('.char-trivedi') || []
      const allLetters = [...Array.from(yashLetters), ...Array.from(trivediLetters)]

      gsap.set(solidLayerRef.current, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 20,
        scaleX: 0.95,
        scaleY: 1.18,
        opacity: 0,
        filter: 'blur(8px)',
      })
      gsap.set([solidYashRef.current, solidTrivediRef.current], { x: 0 })
      gsap.set(allLetters, { opacity: 0, y: 16 })

      // Corner metadata starts hidden
      gsap.set([topLeftRef.current, topRightRef.current, bottomLeftRef.current, bottomRightRef.current], {
        opacity: 0,
        y: 10,
      })

      // Master Scroll-Controlled Timeline
      const masterTl = gsap.timeline({
        defaults: { ease: 'none' },
      })

      // =========================================================
      // PHASE 1: GRADUALLY DRAW HORIZONTAL TORN LINE ACROSS SCREEN
      // Loading screen starts completely clean without dividing line
      // =========================================================
      masterTl.to(scrollHintRef.current, { opacity: 0, duration: 0.06 }, 0)

      // Make the line visible as scroll starts
      masterTl.set(crackPathRef.current, { opacity: 1 }, 0.01)

      // Gradually draw the horizontal torn line across the screen
      masterTl.to(
        crackPathRef.current,
        {
          strokeDashoffset: 0,
          duration: 0.17,
          ease: 'power1.inOut',
        },
        0.01
      )

      // =========================================================
      // PHASE 2: SPLITTING ANIMATION
      // Once line is fully drawn, the paper splits along the line
      // =========================================================
      // Switch from uncut poster to splitting halves
      masterTl.set(uncutPosterRef.current, { display: 'none' }, 0.18)
      masterTl.set(splitHalvesRef.current, { display: 'block' }, 0.18)
      masterTl.to(crackPathRef.current, { opacity: 0, duration: 0.04 }, 0.18)

      // Upper and lower halves pull completely apart and off-screen
      masterTl.to(
        topHalfRef.current,
        {
          y: -740,
          x: -22,
          rotation: -3.5,
          duration: 0.54,
          ease: 'power1.inOut',
        },
        0.18
      )

      masterTl.to(
        bottomHalfRef.current,
        {
          y: 740,
          x: 25,
          rotation: 3.0,
          duration: 0.54,
          ease: 'power1.inOut',
        },
        0.18
      )

      // Paper overlay dissolves completely as halves clear off-screen
      masterTl.to(
        paperOverlayRef.current,
        {
          opacity: 0,
          duration: 0.14,
          ease: 'power1.out',
        },
        0.58
      )

      // Loading screen has completely opened and disappeared
      masterTl.set(paperOverlayRef.current, { display: 'none' }, 0.72)

      // =========================================================
      // PHASE 3: ANIMATE "YASH TRIVEDI" AFTER SCREEN COMPLETELY OPENS
      // Cinematic reveal of oversized typography BEHIND character
      // =========================================================
      masterTl.to(
        solidLayerRef.current,
        {
          opacity: 1,
          scaleX: 1.0,
          scaleY: 1.25,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.18,
          ease: 'power2.out',
        },
        0.72
      )

      masterTl.to(
        allLetters,
        {
          opacity: 1,
          y: 0,
          stagger: 0.012,
          duration: 0.16,
          ease: 'power2.out',
        },
        0.73
      )

      // Editorial corners reveal and settle
      masterTl.to(
        [topLeftRef.current, topRightRef.current, bottomLeftRef.current, bottomRightRef.current],
        {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.15,
          ease: 'power2.out',
        },
        0.75
      )

      // PINNED SCROLLTRIGGER: Locks the loading screen fixed in the viewport!
      // User scrolling directly drives the animation timeline.
      const st = ScrollTrigger.create({
        trigger: pinContainerRef.current,
        start: 'top top',
        end: '+=140%',
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        animation: masterTl,
        invalidateOnRefresh: true,
      })

      return () => {
        st.kill()
        masterTl.kill()
      }
    },
    { scope: pinContainerRef }
  )

  return (
    <div ref={pinContainerRef} className="relative w-full h-[100svh] min-h-[560px] bg-[#1A1A1A] select-none">
      {/* ========================================================= */}
      {/* HERO SECTION STAGE (Underneath Torn Paper)                */}
      {/* ========================================================= */}
      <div
        id="hero"
        ref={stageRef}
        className="relative w-full h-full min-h-[560px] bg-[#1A1A1A] overflow-hidden select-none"
        style={{ backgroundColor: '#1A1A1A' }}
      >
        {/* ========================================================= */}
        {/* EDITORIAL CORNERS (Inter Font, #F4E7CD Cream)              */}
        {/* Exact reference positions and clean typography            */}
        {/* ========================================================= */}

        {/* Top Left: Title */}
        <div
          ref={topLeftRef}
          className="absolute top-[8.5%] sm:top-[9.5%] md:top-[10%] left-[5.5%] z-40 pointer-events-auto editorial-corner"
        >
          <span className="font-inter text-[#F4E7CD] text-[15px] sm:text-[16px] md:text-[17px] font-normal tracking-[-0.01em]">
            Full Stack Developer
          </span>
        </div>

        {/* Top Right: Kinetic Navigation Bar */}
        <div
          ref={topRightRef}
          className={`absolute top-[7.5%] sm:top-[8.5%] md:top-[9%] right-[5.5%] pointer-events-auto editorial-corner transition-[z-index] ${
            isMenuOpen ? 'z-[110]' : 'z-40'
          }`}
        >
          <KineticNavigation onOpenChange={setIsMenuOpen} />
        </div>

        {/* Bottom Left: Name */}
        <div
          ref={bottomLeftRef}
          className="absolute bottom-[8.5%] sm:bottom-[9.5%] md:bottom-[10%] left-[5.5%] z-40 pointer-events-auto editorial-corner"
        >
          <span className="font-inter text-[#F4E7CD] text-[15px] sm:text-[16px] md:text-[17px] font-normal tracking-[-0.01em]">
            Yash Trivedi
          </span>
        </div>

        {/* Bottom Right: Website Link */}
        <div
          ref={bottomRightRef}
          className="absolute bottom-[8.5%] sm:bottom-[9.5%] md:bottom-[10%] right-[5.5%] z-40 pointer-events-auto editorial-corner"
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
        {/* LAYER 1: SOLID CREAM FILL BEHIND YASH (z-index: 10)       */}
        {/* Displays full "YASH TRIVEDI" behind character portrait    */}
        {/* ========================================================= */}
        <div
          ref={solidLayerRef}
          className="absolute top-[47%] left-1/2 w-full flex items-center justify-center font-bebas text-[#F4E7CD] text-[17.5vw] sm:text-[19vw] md:text-[20vw] leading-[0.82] tracking-[0.012em] uppercase select-none z-10 pointer-events-none whitespace-nowrap"
          style={{ transform: 'translate(-50%, -50%) scale(1, 1.25)' }}
          aria-hidden="true"
        >
          {/* Solid YASH */}
          <div ref={solidYashRef} className="flex">
            {['Y', 'A', 'S', 'H'].map((char, i) => (
              <span key={i} className="char inline-block">{char}</span>
            ))}
          </div>

          {/* Space where character head and neck sit naturally */}
          <span ref={gapRef} className="inline-block w-[11.5vw] md:w-[12vw]" />

          {/* Solid TRIVEDI */}
          <div ref={solidTrivediRef} className="flex">
            {['T', 'R', 'I', 'V', 'E', 'D', 'I'].map((char, i) => (
              <span key={i} className="char-trivedi inline-block">{char}</span>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* LAYER 2: YASH TRIVEDI PORTRAIT (z-index: 20)              */}
        {/* Character appears strictly in front of the typography     */}
        {/* Naturally covers the middle letters behind his head & body */}
        {/* Zero text outline over character face                      */}
        {/* ========================================================= */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-end justify-center h-[88vh] md:h-[90vh] w-auto max-w-none">
          <div
            ref={portraitRef}
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
        {/* HERO BOTTOM SUBTLE TRANSITION                              */}
        {/* Soft gradient edge fade into the next section             */}
        {/* ========================================================= */}
        <div
          className="absolute bottom-0 left-0 w-full h-24 sm:h-32 pointer-events-none z-25"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(26,26,26,0.6) 60%, #1A1A1A 100%)',
          }}
          aria-hidden="true"
        />

        {/* ========================================================= */}
        {/* LAYER 3: FIXED TORN-EDGE LOADING SCREEN (z-index: 30)     */}
        {/* Starts fixed, splits on scroll, and pulls completely away */}
        {/* ========================================================= */}
        <div ref={paperOverlayRef} className="absolute inset-0 w-full h-full z-30 pointer-events-none select-none">
          <svg
            viewBox={'0 0 ' + VIEW_W + ' ' + VIEW_H}
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full select-none"
          >
            <defs>
              <linearGradient id="hero-curl-top" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F4E7CD" />
                <stop offset="1" stopColor="#232323" />
              </linearGradient>
              <linearGradient id="hero-curl-bottom" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#F4E7CD" />
                <stop offset="1" stopColor="#232323" />
              </linearGradient>
              <filter id="hero-paper-soft" x="-20%" y="-50%" width="140%" height="200%">
                <feGaussianBlur stdDeviation="14" />
              </filter>
              <clipPath id="hero-clip-top">
                <path d={d(topShape)} />
              </clipPath>
              <clipPath id="hero-clip-bottom">
                <path d={d(bottomShape)} />
              </clipPath>
            </defs>

            {/* Clean intact uncut poster: zero dividing line initially */}
            <g ref={uncutPosterRef}>
              <rect x={-FAR} y={-FAR} width={FAR * 2 + VIEW_W} height={FAR * 2} fill="#1A1A1A" />
              <text
                x={CX}
                y={215}
                textAnchor="middle"
                fill="#8E8677"
                style={{
                  font: '500 24px "Inter", sans-serif',
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                }}
              >
                Welcome to
              </text>
              <text
                x={CX}
                y={400}
                textAnchor="middle"
                textLength={860}
                lengthAdjust="spacingAndGlyphs"
                fill="#F4E7CD"
                style={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontWeight: 900,
                  fontSize: '190px',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}
              >
                PORTFOLIO
              </text>
            </g>

            {/* Splitting Halves: activated once the line finishes drawing */}
            <g ref={splitHalvesRef}>
              {/* Top Half */}
              <g ref={topHalfRef}>
                <path
                  d={d(line, false)}
                  fill="none"
                  stroke="#000000"
                  strokeOpacity={0.75}
                  strokeWidth={28}
                  transform="translate(0 14)"
                  filter="url(#hero-paper-soft)"
                />
                <g clipPath="url(#hero-clip-top)">
                  <rect x={-FAR} y={-FAR} width={FAR * 2 + VIEW_W} height={FAR * 2} fill="#1A1A1A" />
                  <text
                    x={CX}
                    y={215}
                    textAnchor="middle"
                    fill="#8E8677"
                    style={{
                      font: '500 24px "Inter", sans-serif',
                      letterSpacing: '0.42em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Welcome to
                  </text>
                  <text
                    x={CX}
                    y={400}
                    textAnchor="middle"
                    textLength={860}
                    lengthAdjust="spacingAndGlyphs"
                    fill="#F4E7CD"
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontWeight: 900,
                      fontSize: '190px',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    PORTFOLIO
                  </text>
                </g>
                {/* Exposed cream paper core fibers & curls */}
                <path d={d(topCore)} fill="#F4E7CD" />
                {topCurls.map((curlD, i) => (
                  <path key={i} d={curlD} fill="url(#hero-curl-top)" stroke="#F4E7CD" strokeWidth={0.8} />
                ))}
              </g>

              {/* Bottom Half */}
              <g ref={bottomHalfRef}>
                <path
                  d={d(line, false)}
                  fill="none"
                  stroke="#000000"
                  strokeOpacity={0.75}
                  strokeWidth={28}
                  transform="translate(0 -14)"
                  filter="url(#hero-paper-soft)"
                />
                <g clipPath="url(#hero-clip-bottom)">
                  <rect x={-FAR} y={-FAR} width={FAR * 2 + VIEW_W} height={FAR * 2} fill="#1A1A1A" />
                  <text
                    x={CX}
                    y={215}
                    textAnchor="middle"
                    fill="#8E8677"
                    style={{
                      font: '500 24px "Inter", sans-serif',
                      letterSpacing: '0.42em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Welcome to
                  </text>
                  <text
                    x={CX}
                    y={400}
                    textAnchor="middle"
                    textLength={860}
                    lengthAdjust="spacingAndGlyphs"
                    fill="#F4E7CD"
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontWeight: 900,
                      fontSize: '190px',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    PORTFOLIO
                  </text>
                </g>
                {/* Exposed cream paper core fibers & curls */}
                <path d={d(bottomCore)} fill="#F4E7CD" />
                {bottomCurls.map((curlD, i) => (
                  <path key={i} d={curlD} fill="url(#hero-curl-bottom)" stroke="#F4E7CD" strokeWidth={0.8} />
                ))}
              </g>
            </g>

            {/* Horizontal torn line that gradually draws across the screen as user scrolls */}
            <path
              ref={crackPathRef}
              d={d(crackLine, false)}
              fill="none"
              stroke="#F4E7CD"
              strokeWidth={2.4}
              strokeLinejoin="bevel"
            />
          </svg>

          {/* Scroll hint on initial poster */}
          <div
            ref={scrollHintRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] text-[#8E8677]"
          >
            scroll
            <span className="block h-6 w-px animate-pulse motion-reduce:animate-none bg-[#8E8677]" />
          </div>
        </div>
      </div>
    </div>
  )
}
