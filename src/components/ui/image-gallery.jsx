import { useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_ACHIEVEMENTS = [
  {
    id: 1,
    year: "2025",
    title: "Production Design System Lead",
    description:
      "Architected a modular React & GSAP component library powering high-traffic interactive web applications.",
    src: "https://cdn.21st.dev/assets/mirror/21/21bf561c0452c2fae65a5c747aeba0996e6942fcb8eb3e628c50478f458065c5.jpg",
    alt: "Production Design System Achievement",
  },
  {
    id: 2,
    year: "2025",
    title: "1st Place — National Web Summit",
    description:
      "Built and shipped an AI-assisted full stack workflow engine within 36 hours ahead of 120+ competing teams.",
    src: "https://cdn.21st.dev/assets/mirror/7c/7c873d1af9cfb98c26de10dc98e807bcec8de8321936158d1b0e82c6b7f73d0c.jpg",
    alt: "National Web Summit First Place Achievement",
  },
  {
    id: 3,
    year: "2024",
    title: "99+ Core Web Vitals Benchmark",
    description:
      "Optimized rendering pipelines and bundle delivery across enterprise platforms to sub-second FCP.",
    src: "https://cdn.21st.dev/assets/mirror/35/350edca6de5b00194dbba8be86d6fc51f9192901ed127fd67855f369ff3bc9e5.jpg",
    alt: "Core Web Vitals Benchmark Achievement",
  },
  {
    id: 4,
    year: "2024",
    title: "15+ Shipped Client Platforms",
    description:
      "Delivered end-to-end scalable SaaS, e-commerce, and creative web experiences from concept to deployment.",
    src: "https://cdn.21st.dev/assets/mirror/dc/dc1338c2544ff95224a36bff0cd432e122417e6250bfd0ff82fbfceacfbf3283.jpg",
    alt: "Shipped Client Platforms Achievement",
  },
  {
    id: 5,
    year: "2023",
    title: "Featured Interactive Portfolio",
    description:
      "Recognized for pairing editorial typography, kinetic scroll choreography, and resilient full-stack engineering.",
    src: "https://cdn.21st.dev/assets/mirror/ba/ba6557999b707efbaa73506debbc594e0703c071fdfc05951c9b355f0ad078e8.jpg",
    alt: "Featured Interactive Portfolio Achievement",
  },
];

export default function AchievementsGallery({
  achievements = DEFAULT_ACHIEVEMENTS,
  title = "ACHIEVEMENTS",
  subtitle = "Five defining milestones across full-stack engineering, performance architecture, and interactive web design.",
  className,
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const items = achievements.slice(0, 5);

  return (
    <section
      id="achievements"
      className={cn(
        "relative w-full bg-[#1A1A1A] text-[#F9F9F9] pt-12 pb-20 sm:pt-14 sm:pb-24 md:pt-14 md:pb-24 px-4 sm:px-6 md:px-8",
        className
      )}
    >
      {/* Editorial Section Header */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-[0.03em] uppercase text-[#F4E7CD] leading-[0.95]">
          {title}
        </h2>

        <p className="font-inter text-sm sm:text-base text-[#8E8677] mt-3 sm:mt-4 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Top 5 Expanding Accordion Gallery — equal clean strips until hovered */}
      <div
        className="flex flex-col md:flex-row items-stretch gap-2.5 sm:gap-3 w-full max-w-5xl mx-auto mt-10 sm:mt-12 md:mt-14"
        onMouseLeave={() => setActiveIndex(null)}
      >
        {items.map((item, idx) => {
          const isActive = activeIndex === idx;

          return (
            <div
              key={item.id ?? idx}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-label={`${item.title} (${item.year})`}
              onMouseEnter={() => setActiveIndex(idx)}
              onFocus={() => setActiveIndex(idx)}
              onBlur={() => setActiveIndex(null)}
              onClick={() => setActiveIndex((prev) => (prev === idx ? null : idx))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIndex((prev) => (prev === idx ? null : idx));
                }
              }}
              className={cn(
                "relative group rounded-xl md:rounded-2xl overflow-hidden border bg-[#232323] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none",
                isActive
                  ? "h-[260px] sm:h-[290px] md:h-[430px] lg:h-[460px] md:flex-[3.2] border-[#FDC3A1]/50"
                  : "h-[140px] sm:h-[160px] md:h-[430px] lg:h-[460px] md:flex-[1] border-[#3A3A3A]/70 hover:border-[#FDC3A1]/40"
              )}
            >
              {/* Pure Background Visual (unobscured at rest) */}
              <img
                className={cn(
                  "h-full w-full object-cover object-center transition-transform duration-700 ease-out",
                  isActive ? "scale-[1.03]" : "scale-100"
                )}
                src={item.src}
                alt={item.alt || item.title}
                loading="lazy"
              />

              {/* Hover-Only Dark Vignette */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/50 to-[#1A1A1A]/15 transition-opacity duration-300 ease-out pointer-events-none",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />

              {/* Hover-Only Year Pill */}
              <div
                className={cn(
                  "absolute top-4 right-4 transition-all duration-300 ease-out pointer-events-none",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                )}
              >
                <span className="font-inter text-[10px] sm:text-[11px] font-medium tracking-[0.06em] uppercase px-2.5 py-1 rounded-full border text-[#1A1A1A] bg-[#F4E7CD] border-[#F4E7CD]">
                  {item.year}
                </span>
              </div>

              {/* Hover-Only Title & Description */}
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 transition-all duration-300 ease-out pointer-events-none",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                )}
              >
                <h3 className="font-bebas text-2xl sm:text-3xl md:text-[2.15rem] tracking-[0.02em] uppercase text-[#F4E7CD] leading-none mb-2">
                  {item.title}
                </h3>
                <p className="font-inter text-xs sm:text-sm text-[#F9F9F9]/85 leading-relaxed max-w-md line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { AchievementsGallery as ImageGallery };
