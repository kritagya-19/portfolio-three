import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LOGOS } from '@/components/ui/logo-clouds-utils/logos'

const WIPE_DURATION = 0.92
const WIPE_TIMES = [0, 0.4, 1]

const DEFAULT_LOGOS = LOGOS.map((l) => ({
  icon: (
    <l.Icon
      className="h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 object-contain"
      style={{ color: l.color }}
      aria-hidden="true"
    />
  ),
  name: l.name,
  id: l.name,
}))

function LogoItem({ logo, index, isWaving, stagger, totalCount, onDone }) {
  return (
    <motion.div
      aria-label={logo.name ?? 'Logo'}
      title={logo.name}
      animate={
        isWaving
          ? {
              clipPath: ['inset(0 0% 0 0)', 'inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
              filter: ['blur(0px)', 'blur(8px)', 'blur(0px)'],
              opacity: [1, 0.25, 1],
            }
          : {
              clipPath: 'inset(0 0% 0 0)',
              filter: 'blur(0px)',
              opacity: 1,
            }
      }
      transition={
        isWaving
          ? {
              clipPath: {
                duration: WIPE_DURATION,
                times: WIPE_TIMES,
                ease: ['easeIn', [0.16, 1, 0.3, 1]],
                delay: index * stagger,
              },
              filter: {
                duration: WIPE_DURATION * 0.9,
                times: WIPE_TIMES,
                ease: 'easeInOut',
                delay: index * stagger,
              },
              opacity: {
                duration: WIPE_DURATION * 0.85,
                times: WIPE_TIMES,
                ease: 'easeInOut',
                delay: index * stagger,
              },
            }
          : {
              duration: 0.3,
              ease: 'easeOut',
            }
      }
      onAnimationComplete={() => {
        if (isWaving && index === totalCount - 1) onDone()
      }}
      whileHover={{
        scale: 1.15,
        opacity: 1,
        filter: 'blur(0px)',
        transition: { type: 'spring', stiffness: 360, damping: 22 },
      }}
      className="flex items-center justify-center p-2 sm:p-3 cursor-pointer select-none transition-transform"
    >
      <span className="flex items-center justify-center transition-opacity hover:opacity-100">
        {logo.icon}
      </span>
    </motion.div>
  )
}

export default function LogoCloudSwap({
  logos = DEFAULT_LOGOS,
  title = 'TECH STACK & SKILLS',
  interval = 3200,
  stagger = 0.08,
  className,
}) {
  const [waving, setWaving] = React.useState(false)

  React.useEffect(() => {
    const id = setInterval(() => setWaving(true), interval)
    return () => clearInterval(id)
  }, [interval])

  return (
    <section
      className={cn(
        'relative w-full bg-transparent px-4 pt-16 sm:pt-24 md:pt-28 pb-6 sm:pb-10 md:pb-12 flex flex-col items-center justify-center text-center',
        className
      )}
    >
      {/* Centered Single Heading (No extra text/eyebrow/subtitle) */}
      <div className="w-full max-w-3xl flex flex-col items-center justify-center text-center mx-auto">
        <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl text-[#F4E7CD] tracking-[0.04em] uppercase text-center w-full">
          {title}
        </h2>
      </div>

      {/* Symmetrical Centered Grid of Pure Tech Logos (No box containers, No names) */}
      <div className="w-full max-w-4xl mt-6 sm:mt-8 flex items-center justify-center mx-auto">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 sm:gap-6 md:gap-7 place-items-center">
          {logos.map((logo, i) => (
            <LogoItem
              key={logo.id ?? i}
              logo={logo}
              index={i}
              isWaving={waving}
              stagger={stagger}
              totalCount={logos.length}
              onDone={() => setWaving(false)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
