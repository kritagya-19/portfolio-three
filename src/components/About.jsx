import React, { forwardRef } from 'react'

const About = forwardRef(function About(
  {
    line1Ref,
    line2Ref,
    line3Ref,
    line4Ref,
    line5Ref,
    line6Ref,
    underlineRef,
    footerRef,
  },
  ref
) {
  return (
    <div
      ref={ref}
      className="relative w-full h-[100svh] min-h-[580px] bg-[#1A1A1A] text-[#F9F9F9] flex flex-col justify-between px-6 sm:px-10 md:px-16 lg:px-24 py-8 sm:py-10 select-none overflow-hidden"
      style={{ backgroundColor: '#1A1A1A' }}
    >
      {/* Top spacer (top header removed per user request) */}
      <div className="w-full h-4 flex-shrink-0" />

      {/* ========================================================= */}
      {/* CENTER STAGE: MONUMENTAL 6-LINE EDITORIAL STATEMENT        */}
      {/* ========================================================= */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-auto z-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Line 1 */}
          <div className="overflow-visible py-0.5 sm:py-1">
            <h2
              ref={line1Ref}
              className="font-bebas text-[#F4E7CD] text-[7.8vw] sm:text-[5.8vw] md:text-[4.4vw] lg:text-[3.6vw] xl:text-[3.2vw] leading-[0.92] tracking-[0.02em] uppercase m-0 will-change-transform will-change-filter"
              style={{
                filter: 'blur(14px)',
                opacity: 0.2,
              }}
            >
              I BUILD DIGITAL EXPERIENCES
            </h2>
          </div>

          {/* Line 2 */}
          <div className="overflow-visible py-0.5 sm:py-1">
            <h2
              ref={line2Ref}
              className="font-bebas text-[#F4E7CD] text-[7.8vw] sm:text-[5.8vw] md:text-[4.4vw] lg:text-[3.6vw] xl:text-[3.2vw] leading-[0.92] tracking-[0.02em] uppercase m-0 flex items-center justify-center flex-wrap gap-[0.25em] will-change-transform will-change-filter"
              style={{
                filter: 'blur(14px)',
                opacity: 0.2,
              }}
            >
              <span>THAT FEEL</span>
              <span className="relative inline-block italic text-[#FDC3A1] pb-1">
                DIFFERENT.
                {/* Hand-drawn peach underline SVG */}
                <svg
                  ref={underlineRef}
                  className="absolute bottom-0 left-0 w-full h-[5px] sm:h-[7px] text-[#FDC3A1] pointer-events-none"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  style={{ opacity: 0 }}
                >
                  <path
                    d="M2 5.5C50 2 150 1.5 198 4"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          </div>

          {/* Line 3 */}
          <div className="overflow-visible py-0.5 sm:py-1">
            <h2
              ref={line3Ref}
              className="font-bebas text-[#F4E7CD] text-[7.8vw] sm:text-[5.8vw] md:text-[4.4vw] lg:text-[3.6vw] xl:text-[3.2vw] leading-[0.92] tracking-[0.02em] uppercase m-0 will-change-transform will-change-filter"
              style={{
                filter: 'blur(14px)',
                opacity: 0.2,
              }}
            >
              CRAFTING MODERN, INTERACTIVE
            </h2>
          </div>

          {/* Line 4 */}
          <div className="overflow-visible py-0.5 sm:py-1">
            <h2
              ref={line4Ref}
              className="font-bebas text-[#F4E7CD] text-[7.8vw] sm:text-[5.8vw] md:text-[4.4vw] lg:text-[3.6vw] xl:text-[3.2vw] leading-[0.92] tracking-[0.02em] uppercase m-0 will-change-transform will-change-filter"
              style={{
                filter: 'blur(14px)',
                opacity: 0.2,
              }}
            >
              AND HIGH-PERFORMANCE SYSTEMS
            </h2>
          </div>

          {/* Line 5 */}
          <div className="overflow-visible py-0.5 sm:py-1">
            <h2
              ref={line5Ref}
              className="font-bebas text-[#F4E7CD] text-[7.8vw] sm:text-[5.8vw] md:text-[4.4vw] lg:text-[3.6vw] xl:text-[3.2vw] leading-[0.92] tracking-[0.02em] uppercase m-0 will-change-transform will-change-filter"
              style={{
                filter: 'blur(14px)',
                opacity: 0.2,
              }}
            >
              WHERE INTUITIVE DESIGN MEETS
            </h2>
          </div>

          {/* Line 6 */}
          <div className="overflow-visible py-0.5 sm:py-1">
            <h2
              ref={line6Ref}
              className="font-bebas text-[#F4E7CD] text-[7.8vw] sm:text-[5.8vw] md:text-[4.4vw] lg:text-[3.6vw] xl:text-[3.2vw] leading-[0.92] tracking-[0.02em] uppercase m-0 will-change-transform will-change-filter"
              style={{
                filter: 'blur(14px)',
                opacity: 0.2,
              }}
            >
              SEAMLESS ENGINEERING.
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM EDITORIAL BAR                                       */}
      {/* ========================================================= */}
      <footer
        ref={footerRef}
        className="w-full flex items-center justify-between pt-4 sm:pt-5 border-t border-[#3A3A3A] z-20 flex-shrink-0"
      >
        <span className="font-inter text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#8E8677]">
          DESIGN MINDED. CODE DRIVEN.
        </span>
        <div className="flex items-center gap-2 font-inter text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#F4E7CD]">
          <span>SCROLL TO EXPLORE</span>
          <span className="inline-block animate-bounce text-[#FDC3A1]">↓</span>
        </div>
      </footer>
    </div>
  )
})

export default About
