import * as React from "react"

/**
 * Editorial Wordmark Footer — clean dark matte closing section matching
 * the approved dark editorial portfolio style: #1A1A1A background,
 * subtle #3A3A3A borders, Bebas Neue cream wordmark, and restrained accents.
 */

// #region typography & sizing helpers
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)

/**
 * Font size (px) that makes a word measured at 100px span `target` px.
 * Capped at `cap` px so short words do not grow disproportionately tall.
 */
const fitSize = (measuredAt100, target, cap) => {
  if (!(measuredAt100 > 0) || !(target > 0)) return 0
  const size = (100 * target) / measuredAt100
  return cap > 0 ? Math.min(size, cap) : size
}

/**
 * Where the baseline sits in a `line-height: 1` box, as a fraction of the font
 * size, from the font's ascent and descent at 100px.
 */
const baselineAt = (ascent, descent) => {
  if (!(ascent > 0) || !(descent >= 0)) return 0.8
  return clamp(((100 - ascent - descent) / 2 + ascent) / 100, 0.5, 1.2)
}

/** Visible wordmark height: down to the baseline, plus `cut` em below it. */
const wordHeight = (fontSize, baseline, cut) =>
  Math.max(0, fontSize * (baseline + clamp(Number.isFinite(cut) ? cut : 0, -0.4, 0.4)))
// #endregion

const DEFAULT_SOCIALS = [
  { label: "GitHub", href: "https://github.com", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { label: "X", href: "https://x.com", icon: "x" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
]

const DEFAULT_COLUMNS = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "#hero" },
      { label: "Stories", href: "#stories" },
      { label: "Tech Stack", href: "#tech-stack" },
      { label: "Philosophy", href: "#philosophy" },
      { label: "Projects", href: "#projects" },
      { label: "Achievements", href: "#achievements" },
      { label: "Timeline", href: "#timeline" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Portfolio", href: "https://www.yashtrivedi.dev" },
      { label: "GitHub", href: "https://github.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Contact", href: "https://www.yashtrivedi.dev" },
    ],
  },
]

const SANS =
  "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
const DISPLAY = "'Bebas Neue', sans-serif"

const ICONS = {
  x: (
    <path
      d="M17.6 3.5h2.9l-6.3 7.2 7.4 9.8h-5.8l-4.5-5.9-5.2 5.9H3.2l6.7-7.7L2.8 3.5h5.9l4.1 5.4 4.8-5.4Zm-1 15.3h1.6L7.9 5.1H6.2l10.4 13.7Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  ),
  linkedin: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M8 10.5V16M12 16v-5.5M12 13c0-1.6 1-2.6 2.4-2.6s2.1.9 2.1 2.4V16" />
      <circle cx="8" cy="7.7" r=".55" fill="currentColor" />
    </g>
  ),
  youtube: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <rect x="2.75" y="5.5" width="18.5" height="13" rx="4" />
      <path d="M10.2 9.3v5.4l4.6-2.7-4.6-2.7Z" />
    </g>
  ),
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.1" cy="6.9" r=".6" fill="currentColor" stroke="none" />
    </g>
  ),
  github: (
    <path
      d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  dribbble: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.6 4.2c3.4 4.4 5.4 9.6 6.1 15.6M3.6 10.6c5.6.3 10.4-1 13.9-4.4M5.6 17.6c3.4-4.2 8.6-5.6 14.8-3.6" />
    </g>
  ),
}

/** Baseline of the wordmark's actual font, read off a canvas. */
const measureBaseline = (family, weight, text) => {
  try {
    const ctx = document.createElement("canvas").getContext("2d")
    if (!ctx) return 0.8
    ctx.font = weight + " 100px " + family
    const m = ctx.measureText(text)
    return baselineAt(m.fontBoundingBoxAscent, m.fontBoundingBoxDescent)
  } catch {
    return 0.8
  }
}

const isIconName = (v) => typeof v === "string" && v in ICONS

// Clean matte scoped stylesheet: no beams, no shine, no glowing gradients.
const CSS =
  ".bwf{position:relative;isolation:isolate;overflow:hidden;container-type:inline-size;background:transparent;color:#F9F9F9;font-family:var(--bwf-sans);-webkit-font-smoothing:antialiased;touch-action:pan-y}" +
  ":where(.bwf) a{color:inherit;text-decoration:none}" +
  ":where(.bwf) button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer}" +
  ":where(.bwf) ul{list-style:none;margin:0;padding:0}" +
  ":where(.bwf) p{margin:0}" +
  ".bwf svg{max-width:none;display:block}" +
  ".bwf .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}" +
  ".bwf-inner{position:relative;z-index:2;box-sizing:border-box;max-width:1120px;margin:0 auto;padding:clamp(48px,8.5cqw,104px) clamp(20px,6cqw,88px) 0;display:grid;grid-template-columns:minmax(0,1.62fr) minmax(0,.86fr) minmax(0,.86fr);column-gap:clamp(24px,4cqw,48px);row-gap:44px}" +
  ".bwf-label{font-size:12px;line-height:1;letter-spacing:.06em;text-transform:uppercase;color:#FDC3A1;padding-bottom:13px;position:relative;display:block}" +
  ".bwf-label::after{content:'';position:absolute;left:0;right:0;bottom:0;height:1px;background:#3A3A3A;transform-origin:0 50%;transform:scaleX(var(--bwf-line,1));transition:transform 1.1s cubic-bezier(.2,.7,.1,1) var(--bwf-d,0ms)}" +
  ".bwf[data-in='false'] .bwf-label::after{--bwf-line:0}" +
  ".bwf-col{min-width:0}" +
  ".bwf-col:nth-child(1){max-width:420px}" +
  ".bwf-fade{transition:opacity .9s ease var(--bwf-d,0ms),translate .9s cubic-bezier(.2,.7,.1,1) var(--bwf-d,0ms)}" +
  ".bwf[data-in='false'] .bwf-fade{opacity:0;translate:0 14px}" +
  ".bwf-socials{display:flex;gap:14px;margin-top:16px}" +
  ".bwf-soc{position:relative;width:34px;height:34px;display:grid;place-items:center;border-radius:6px;color:#8E8677;background:#232323;border:1px solid #3A3A3A;transition:color .25s,border-color .3s,translate .3s cubic-bezier(.2,.8,.2,1)}" +
  ".bwf-soc svg{width:17px;height:17px}" +
  ".bwf-soc:hover,.bwf-soc:focus-visible{color:#FDC3A1;translate:0 -2px;background:#232323;border-color:#FDC3A1}" +
  ".bwf-soc:focus-visible{outline:none}" +
  ".bwf-tip{position:absolute;z-index:5;left:50%;top:calc(100% + 9px);translate:-50% -4px;white-space:nowrap;font-size:11px;font-weight:500;line-height:1;padding:6px 8px;border-radius:4px;background:#FDC3A1;color:#1A1A1A;opacity:0;pointer-events:none;transition:opacity .2s,translate .25s}" +
  ".bwf-tip::after{content:'';position:absolute;left:50%;bottom:100%;margin-left:-4px;border:4px solid transparent;border-bottom-color:#FDC3A1}" +
  ".bwf-soc:hover .bwf-tip,.bwf-soc:focus-visible .bwf-tip{opacity:1;translate:-50% 0}" +
  ".bwf-credits{margin-top:21px;font-size:14px;line-height:1.55;color:#8E8677}" +
  ".bwf-credits p+p{margin-top:3px}" +
  ".bwf-credits b{font-weight:500;color:#F4E7CD}" +
  ".bwf-credits a{color:#F4E7CD;text-decoration:none;transition:color .25s}" +
  ".bwf-credits a:hover,.bwf-credits a:focus-visible{color:#FDC3A1;outline:none}" +
  ".bwf-links{margin-top:13px;display:flex;flex-direction:column;gap:0}" +
  ".bwf-link{position:relative;display:inline-flex;align-items:center;gap:8px;padding:6px 0;font-size:14.5px;line-height:21px;color:#F9F9F9;transition:color .25s}" +
  ".bwf-link-t{display:inline-block;transition:translate .35s cubic-bezier(.2,.8,.2,1)}" +
  ".bwf-link::before{content:'';position:absolute;left:0;top:50%;width:6px;height:1px;margin-top:0;background:#FDC3A1;transform:scaleX(0);transform-origin:0 50%;transition:transform .35s cubic-bezier(.2,.8,.2,1)}" +
  ".bwf-link svg{width:12px;height:12px;opacity:0;translate:-6px 0;color:#FDC3A1;transition:opacity .25s,translate .35s cubic-bezier(.2,.8,.2,1)}" +
  ".bwf-link:hover,.bwf-link:focus-visible{color:#F4E7CD;outline:none}" +
  ".bwf-link:hover::before,.bwf-link:focus-visible::before{transform:scaleX(1)}" +
  ".bwf-link:hover .bwf-link-t,.bwf-link:focus-visible .bwf-link-t{translate:12px 0}" +
  ".bwf-link:hover svg,.bwf-link:focus-visible svg{opacity:1;translate:10px 0}" +
  ".bwf-link:focus-visible .bwf-link-t{text-decoration:underline;text-underline-offset:4px;text-decoration-color:#FDC3A1}" +
  // The wordmark: solid matte cream Bebas Neue typography with zero shine
  ".bwf-word{position:relative;z-index:1;overflow:hidden;margin-top:clamp(28px,7cqw,96px)}" +
  ".bwf-word-box{padding:0 clamp(20px,6cqw,88px);max-width:1120px;margin:0 auto;box-sizing:border-box}" +
  ".bwf-word-in{display:inline-flex;white-space:nowrap;font-family:var(--bwf-display);font-weight:var(--bwf-ww);line-height:1;letter-spacing:.015em;text-transform:uppercase;user-select:none;-webkit-user-select:none}" +
  ".bwf-lw{display:inline-block;translate:0 0;transition:translate 1.25s cubic-bezier(.16,.84,.2,1) var(--bwf-d,0ms)}" +
  ".bwf[data-in='false'] .bwf-lw{translate:0 85%}" +
  ".bwf-l{display:inline-block;cursor:pointer;color:#F4E7CD;transition:transform .4s cubic-bezier(.2,.9,.25,1.2),color .25s;transform-origin:50% 100%}" +
  ".bwf-l:hover{transform:translateY(-.045em);color:#FDC3A1}" +
  ".bwf-l.is-hop{animation:bwf-hop .75s cubic-bezier(.2,.8,.2,1)}" +
  "@keyframes bwf-hop{0%{transform:translateY(0) scale(1,1)}18%{transform:translateY(.02em) scale(1.06,.9)}45%{transform:translateY(-.14em) scale(.97,1.05)}70%{transform:translateY(.01em) scale(1.02,.97)}100%{transform:translateY(-.045em) scale(1,1)}}" +
  // Restrained bottom fade sinking cleanly into #1A1A1A
  ".bwf-foot{position:absolute;left:0;right:0;bottom:0;height:24%;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(26,26,26,.85) 60%,#1A1A1A)}" +
  "@container (max-width: 760px){.bwf-inner{grid-template-columns:minmax(0,1fr) minmax(0,1fr);row-gap:40px}.bwf-col:nth-child(1){grid-column:1 / -1;max-width:none}}" +
  "@media (prefers-reduced-motion: reduce){.bwf .bwf-lw,.bwf .bwf-fade,.bwf .bwf-label::after,.bwf .bwf-l,.bwf .bwf-soc,.bwf .bwf-link-t,.bwf .bwf-link svg{transition:none!important;animation:none!important}.bwf[data-in='false'] .bwf-lw,.bwf[data-in='false'] .bwf-fade{translate:none;opacity:1}.bwf[data-in='false'] .bwf-label::after{--bwf-line:1}}"

const Arrow = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path
      d="M2.5 9.5l7-7M4 2.5h5.5V8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function BeamWordmarkFooter({
  brand = "Yash Trivedi",
  wordmark = "YASH TRIVEDI",
  company,
  year = new Date().getFullYear(),
  socials = DEFAULT_SOCIALS,
  credits,
  columns = DEFAULT_COLUMNS,
  onLinkClick,
  cut = 0.08,
  fontSans = SANS,
  fontDisplay = DISPLAY,
  wordWeight = 400,
  className = "",
}) {
  const word = (wordmark ?? brand).trim() || brand
  const letters = React.useMemo(() => Array.from(word), [word])
  const credit = credits ?? [
    { lead: "Designed & built by ", label: "Yash Trivedi", href: "https://www.yashtrivedi.dev" },
    { lead: "Full Stack Developer — ", label: "yashtrivedi.dev", href: "https://www.yashtrivedi.dev" },
  ]

  const rootRef = React.useRef(null)
  const wordRef = React.useRef(null)
  const innerRef = React.useRef(null)
  const [size, setSize] = React.useState(0)
  const [base, setBase] = React.useState(0.8)
  const [seen, setSeen] = React.useState(false)

  React.useLayoutEffect(() => {
    const root = rootRef.current
    const box = wordRef.current
    const inner = innerRef.current
    if (!root || !box || !inner) return
    let frame = 0
    const fit = () => {
      const wb = inner.parentElement ?? box
      const pad = parseFloat(getComputedStyle(wb).paddingLeft) || 0
      const target = wb.clientWidth - pad * 2
      inner.style.fontSize = "100px"
      const measured = inner.offsetWidth
      setBase(measureBaseline(getComputedStyle(inner).fontFamily, wordWeight, word))
      const next = fitSize(measured, target, target * 0.42)
      inner.style.fontSize = next + "px"
      setSize(next)
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(fit)
    }
    fit()
    const ro = new ResizeObserver(schedule)
    ro.observe(root)
    let alive = true
    document.fonts?.ready?.then(() => alive && schedule())
    return () => {
      alive = false
      cancelAnimationFrame(frame)
      ro.disconnect()
    }
  }, [word, fontSans, fontDisplay, wordWeight])

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setSeen(true)
      },
      { threshold: 0.12 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onMq = () => setReduced(mq.matches)
    onMq()
    mq.addEventListener("change", onMq)
    return () => mq.removeEventListener("change", onMq)
  }, [])

  const hop = (e) => {
    if (reduced) return
    const el = e.currentTarget
    el.classList.remove("is-hop")
    void el.offsetWidth
    el.classList.add("is-hop")
  }

  const follow = (e, label, href) => {
    if (!href || href === "#") {
      e.preventDefault()
    } else if (href.startsWith("#")) {
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: "smooth" })
      }
    }
    onLinkClick?.(label, href)
  }

  const vars = {
    "--bwf-sans": fontSans,
    "--bwf-display": fontDisplay,
    "--bwf-ww": String(wordWeight),
  }

  const label = company ?? brand
  const delayAt = (step) => ({ "--bwf-d": step * 70 + "ms" })
  const creditsBaseStep = 2 + socials.length
  const columnBaseStep = (ci) =>
    creditsBaseStep + credit.length + columns.slice(0, ci).reduce((sum, col) => sum + 1 + col.links.length, 0)

  return (
    <footer
      ref={rootRef}
      className={"bwf " + className}
      style={vars}
      data-in={seen || reduced ? "true" : "false"}
    >
      <style>{CSS}</style>

      <div className="bwf-inner">
        <div className="bwf-col">
          <p className="bwf-label" style={delayAt(1)}>
            © {year} {label}
          </p>
          {socials.length > 0 && (
            <ul className="bwf-socials">
              {socials.map((s, i) => (
                <li key={s.label + i} className="bwf-fade" style={delayAt(2 + i)}>
                  <a
                    className="bwf-soc"
                    href={s.href || "#"}
                    aria-label={s.label}
                    onClick={(e) => follow(e, s.label, s.href)}
                    {...(s.href && /^https?:/.test(s.href) ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {isIconName(s.icon) ? ICONS[s.icon] : s.icon}
                    </svg>
                    <span className="bwf-tip" aria-hidden="true">
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {credit.length > 0 && (
            <div className="bwf-credits">
              {credit.map((c, i) => (
                <p key={i} className="bwf-fade" style={delayAt(creditsBaseStep + i)}>
                  {c.lead}
                  {c.href ? (
                    <a
                      href={c.href}
                      onClick={(e) => follow(e, c.label, c.href)}
                      {...(/^https?:/.test(c.href) ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      {c.label}
                    </a>
                  ) : (
                    <b>{c.label}</b>
                  )}
                  {c.tail}
                </p>
              ))}
            </div>
          )}
        </div>

        {columns.map((col, ci) => {
          const baseStep = columnBaseStep(ci)
          return (
            <nav key={col.title + ci} className="bwf-col" aria-label={col.title}>
              <p className="bwf-label" style={delayAt(baseStep)}>
                {col.title}
              </p>
              <ul className="bwf-links">
                {col.links.map((l, li) => (
                  <li key={l.label + li} className="bwf-fade" style={delayAt(baseStep + 1 + li)}>
                    <a
                      className="bwf-link"
                      href={l.href || "#"}
                      onClick={(e) => follow(e, l.label, l.href)}
                      {...(l.href && /^https?:/.test(l.href) ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      <span className="bwf-link-t">{l.label}</span>
                      <Arrow />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )
        })}
      </div>

      <div
        ref={wordRef}
        className="bwf-word"
        style={{ height: size ? wordHeight(size, base, cut) : "calc(" + (0.8 + cut) * 26 + "cqw)" }}
      >
        <p className="sr-only">{word}</p>
        <div className="bwf-word-box">
          <div ref={innerRef} className="bwf-word-in" aria-hidden="true">
            {letters.map((ch, i) => (
              <span key={i} className="bwf-lw" style={{ "--bwf-d": 260 + i * 75 + "ms" }}>
                <span
                  className="bwf-l"
                  onClick={hop}
                  onAnimationEnd={(e) => e.currentTarget.classList.remove("is-hop")}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="bwf-foot" aria-hidden="true" />
      </div>
    </footer>
  )
}
