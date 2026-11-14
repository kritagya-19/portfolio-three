import * as React from "react"

/**
 * Tiger Tear Reveal / Yash Portfolio Intro Reveal
 *
 * Starts as a minimal editorial poster: "Welcome to PORTFOLIO".
 * As the user scrolls, a realistic crack shoots across the text,
 * the sheet tears in two along the jagged crack, revealing Yash's portrait
 * in the opening. As the user scrolls further, the upper and lower halves
 * pull completely apart and clear off the screen, revealing the full Hero section.
 */

// #region tear math & utilities
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

const clamp01 = (x) => (x <= 0 ? 0 : x > 1 ? 1 : x)

function smooth(a, b, x) {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

function scrollProgress(top, height, viewport) {
  const range = height - viewport
  if (range <= 0) return top <= 0 ? 1 : 0
  return clamp01(-top / range)
}

function stages(p) {
  return {
    crack: smooth(0.02, 0.16, p), // crack runs across the word
    open: smooth(0.10, 0.76, p),  // sheet tears and halves pull completely apart
    shake: smooth(0.08, 0.16, p) * (1 - smooth(0.18, 0.28, p)), // subtle jolt of the rip
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

function pieceMotion(open) {
  // Drives the two halves: initial tear separation, then sweeping completely off-screen
  const travel = Math.pow(open, 1.35) * 640
  const rot = open * (1 - open * 0.35)
  return {
    top: { dx: -16 * open, dy: -travel, rot: -3.4 * rot },
    bottom: { dx: 18 * open, dy: travel, rot: 2.8 * rot },
  }
}

function fibreWidths(n, open, seed = 5) {
  const r = rng(seed)
  const k = Math.min(1, open * 4)
  return Array.from({ length: n }, (_, i) => k * (2.5 + 6 * (0.5 + 0.5 * Math.sin(i * 0.37 + seed)) * (0.6 + r() * 0.8)))
}

const VIEW_W = 1000
const VIEW_H = 636
const CX = 500
const CY = 318
const FAR = 4000

const d = (pts, close = true) =>
  "M" + pts.map(([x, y]) => x.toFixed(1) + " " + y.toFixed(1)).join("L") + (close ? "Z" : "")

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

function Half({ id, side, line, open, children }) {
  const up = side === "top"
  const m = pieceMotion(open)[side]
  const shape = up
    ? [[line[0][0], -FAR], [line[line.length - 1][0], -FAR], ...[...line].reverse()]
    : [...line, [line[line.length - 1][0], FAR], [line[0][0], FAR]]
  const widths = fibreWidths(line.length, open, up ? 5 : 8)
  const core = line.concat(line.map(([x, y], i) => [x, y + (up ? -widths[i] : widths[i])]).reverse())
  const curls = CURLS[side].map(([cx, hw, depth]) => {
    const pts = line.filter(([x]) => Math.abs(x - cx) <= hw)
    const back = pts.map(([x, y]) => {
      const s = Math.cos(((x - cx) / hw) * (Math.PI / 2))
      return [x + (up ? 6 : -6) * s * open, y + (up ? 1 : -1) * depth * s * s * Math.min(1, open * 2.5)]
    })
    return d(pts.concat(back.reverse()))
  })
  const transform =
    "translate(" + m.dx.toFixed(2) + " " + m.dy.toFixed(2) + ") rotate(" + m.rot.toFixed(3) + " " + CX + " " + CY + ")"
  const clip = id + "-" + side
  return (
    <g transform={transform}>
      {open > 0 ? (
        <path
          d={d(line, false)}
          fill="none"
          stroke="#000000"
          strokeOpacity={0.7 * Math.min(1, open * 3)}
          strokeWidth={28}
          transform={"translate(0 " + (up ? 14 : -14) + ")"}
          filter={"url(#" + id + "-soft)"}
        />
      ) : null}
      <clipPath id={clip}>
        <path d={d(shape)} />
      </clipPath>
      <g clipPath={"url(#" + clip + ")"}>{children}</g>
      {open > 0 ? (
        <>
          <path d={d(core)} fill="#F4E7CD" />
          {curls.map((c, i) => (
            <path key={i} d={c} fill={"url(#" + id + "-curl-" + side + ")"} stroke="#F4E7CD" strokeWidth={0.8} />
          ))}
        </>
      ) : null}
    </g>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const h = (e) => setReduced(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])
  return reduced
}

export default function TigerTearReveal({
  children,
  word = "PORTFOLIO",
  tagline = "Welcome to my",
  ink = "#F4E7CD",
  paper = "#1A1A1A",
  taglineColor = "#8E8677",
  fontFamily = '"Bebas Neue", sans-serif',
  height = "100svh",
  scrollDistance = "130svh",
  progress,
  hint = true,
  className = "",
}) {
  const rootRef = React.useRef(null)
  const stageRef = React.useRef(null)
  const reduced = usePrefersReducedMotion()
  const id = "ttr" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const line = React.useMemo(() => tearLine(), [])
  const [f, setF] = React.useState({ p: progress ?? 0 })

  const controlled = progress !== undefined
  const cfg = React.useRef({ progress, controlled, reduced })

  React.useEffect(() => {
    cfg.current = { progress, controlled, reduced }
  }, [progress, controlled, reduced])

  React.useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    if (!root || !stage) return
    let raf = 0
    let visible = true
    let p = cfg.current.progress ?? 0
    let lastP = p

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(root)

    function tick() {
      raf = 0
      if (!visible) return
      const c = cfg.current
      const target = c.controlled
        ? clamp01(c.progress ?? 0)
        : scrollProgress(root.getBoundingClientRect().top, root.offsetHeight, stage.offsetHeight)
      p = c.reduced ? (target > 0.3 ? 1 : 0) : p + (target - p) * 0.16
      if (Math.abs(target - p) < 0.0005) p = target

      if (Math.abs(p - lastP) > 1e-4) {
        lastP = p
        setF({ p })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  const s = stages(f.p)
  const shake = reduced ? 0 : Math.sin(f.p * 900) * 5 * s.shake
  const crackReach = s.crack * 620
  const crack = line.filter(([x]) => Math.abs(x - CX) <= crackReach)

  // Paper opacity smoothly fades out as halves finish pulling away
  const paperOpacity = s.open >= 0.78 ? Math.max(0, 1 - (s.open - 0.78) / 0.22) : 1
  const isSplitFullyGone = s.open >= 0.99

  const sheet = (
    <>
      <rect x={-FAR} y={-FAR} width={FAR * 2 + VIEW_W} height={FAR * 2} fill={paper} />
      {tagline ? (
        <text
          x={CX}
          y={215}
          textAnchor="middle"
          fill={taglineColor}
          style={{
            font: '500 24px "Inter", sans-serif',
            letterSpacing: "0.42em",
            textTransform: "uppercase",
          }}
        >
          {tagline}
        </text>
      ) : null}
      <text
        x={CX}
        y={400}
        textAnchor="middle"
        textLength={860}
        lengthAdjust="spacingAndGlyphs"
        fill={ink}
        style={{
          fontFamily: fontFamily,
          fontWeight: 900,
          fontSize: "190px",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        {word}
      </text>
    </>
  )

  return (
    <section
      ref={rootRef}
      className={"relative select-none " + className}
      style={{ height: "calc(" + height + " + " + scrollDistance + ")" }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden"
        style={{ height }}
      >
        {/* UNDERNEATH: Hero Section / Yash Portrait Content */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto">
          {children ? (
            children
          ) : (
            <div className="relative w-full h-full flex items-end justify-center bg-[#1A1A1A]">
              <img
                src="/yash-potrait.png"
                alt="Yash Trivedi"
                className="w-auto h-[88vh] md:h-[90vh] object-contain object-bottom pointer-events-none"
              />
            </div>
          )}
        </div>

        {/* ON TOP: The Tearing Paper Screen (Splits apart as user scrolls, then disappears) */}
        {!isSplitFullyGone ? (
          <svg
            viewBox={"0 0 " + VIEW_W + " " + VIEW_H}
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full select-none z-10 pointer-events-none"
            style={{
              opacity: paperOpacity,
              willChange: "transform, opacity",
            }}
          >
            <defs>
              <linearGradient id={id + "-curl-top"} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F4E7CD" />
                <stop offset="1" stopColor="#232323" />
              </linearGradient>
              <linearGradient id={id + "-curl-bottom"} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#F4E7CD" />
                <stop offset="1" stopColor="#232323" />
              </linearGradient>
              <filter id={id + "-soft"} x="-20%" y="-50%" width="140%" height="200%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
            </defs>

            <g transform={"translate(" + shake.toFixed(2) + " " + (shake * 0.4).toFixed(2) + ")"}>
              {s.open > 0 ? (
                <>
                  <Half id={id} side="top" line={line} open={s.open}>
                    {sheet}
                  </Half>
                  <Half id={id} side="bottom" line={line} open={s.open}>
                    {sheet}
                  </Half>
                </>
              ) : (
                sheet
              )}

              {s.crack > 0 && s.open < 0.15 && crack.length > 1 ? (
                <path
                  d={d(crack, false)}
                  fill="none"
                  stroke="#F4E7CD"
                  strokeWidth={2.4}
                  strokeLinejoin="bevel"
                  opacity={1 - s.open / 0.15}
                />
              ) : null}
            </g>
          </svg>
        ) : null}

        {/* Scroll hint on initial un-torn sheet */}
        {hint && !controlled && s.crack < 0.1 ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] z-20"
            style={{ color: taglineColor, opacity: Math.max(0, 0.7 - s.crack * 5) }}
          >
            scroll
            <span className="block h-6 w-px animate-pulse motion-reduce:animate-none" style={{ background: taglineColor }} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
