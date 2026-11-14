import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, X, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STORY_PHOTOS = [
  {
    id: 1,
    order: 0,
    xDesktop: -320,
    yDesktop: 15,
    xTablet: -200,
    yTablet: 14,
    xMobile: -88,
    yMobile: -56,
    zIndex: 50,
    direction: "left",
    src: "/s1.jpeg",
    alt: "Yash Trivedi and team winning 1st place championship trophy at hackathon",
    title: "Hackathon Victory",
    category: "Milestone",
    date: "Spring 2025",
    caption:
      "Standing on stage holding the first-place championship trophy after 36 hours of non-stop architectural design and rapid engineering.",
  },
  {
    id: 2,
    order: 1,
    xDesktop: -160,
    yDesktop: 32,
    xTablet: -100,
    yTablet: 28,
    xMobile: 88,
    yMobile: -44,
    zIndex: 40,
    direction: "left",
    src: "/s2.jpeg",
    alt: "Midnight sprint and team collaborative workspace",
    title: "Midnight Sprint",
    category: "Teamwork",
    date: "Summer 2025",
    caption:
      "Deep late-night collaborative build session—aligning technical logic, performance tuning, and frontend craft under tight delivery cycles.",
  },
  {
    id: 3,
    order: 2,
    xDesktop: 0,
    yDesktop: 8,
    xTablet: 0,
    yTablet: 6,
    xMobile: 0,
    yMobile: 4,
    zIndex: 30,
    direction: "right",
    src: "/s3.jpeg",
    alt: "Systems architecture and code review discussion",
    title: "Architecture Review",
    category: "Engineering",
    date: "Autumn 2025",
    caption:
      "Analyzing component hierarchies, data flows, and state management strategies to ensure resilience across production workloads.",
  },
  {
    id: 4,
    order: 3,
    xDesktop: 160,
    yDesktop: 22,
    xTablet: 100,
    yTablet: 22,
    xMobile: -78,
    yMobile: 78,
    zIndex: 20,
    direction: "right",
    src: "/s4.jpeg",
    alt: "Product sprint planning and developer roadmap discussion",
    title: "Sprint Alignment",
    category: "Strategy",
    date: "Winter 2025",
    caption:
      "Translating complex product requirements into actionable sprint goals and intuitive, delightful user interactions.",
  },
  {
    id: 5,
    order: 4,
    xDesktop: 320,
    yDesktop: 44,
    xTablet: 200,
    yTablet: 38,
    xMobile: 78,
    yMobile: 90,
    zIndex: 10,
    direction: "left",
    src: "/s5.jpeg",
    alt: "Yash Trivedi visiting Apple Park in Cupertino",
    title: "Cupertino Calling",
    category: "Inspiration",
    date: "2025",
    caption:
      "Experiencing the design rigor and human-centered engineering at Apple Park—a continuous inspiration for minimal and intentional craft.",
  },
];

function useViewportTier() {
  const [tier, setTier] = useState("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setTier("mobile");
      else if (w < 1024) setTier("tablet");
      else setTier("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return tier;
}

export const PhotoGallery = ({ animationDelay = 0.15, revealed }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [prefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const tier = useViewportTier();
  const isActive = prefersReducedMotion || (revealed !== undefined ? revealed : isInView);

  const openStoryAt = useCallback((index) => {
    setSelectedStoryIndex(index);
    setIsArchiveOpen(true);
  }, []);

  useEffect(() => {
    if (!isArchiveOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") setIsArchiveOpen(false);
      if (e.key === "ArrowRight")
        setSelectedStoryIndex((prev) => (prev + 1) % STORY_PHOTOS.length);
      if (e.key === "ArrowLeft")
        setSelectedStoryIndex(
          (prev) => (prev - 1 + STORY_PHOTOS.length) % STORY_PHOTOS.length
        );
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isArchiveOpen]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: animationDelay,
      },
    },
  };

  const photoVariants = {
    hidden: () => ({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    }),
    visible: (custom) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.14,
      },
    }),
  };

  const cardSize = tier === "mobile" ? 132 : tier === "tablet" ? 172 : 220;
  const activeStory = STORY_PHOTOS[selectedStoryIndex];

  return (
    <div
      ref={sectionRef}
      className="relative w-full py-10 sm:py-14 md:py-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Editorial Section Header */}
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-inter text-[11px] sm:text-xs font-medium uppercase tracking-[0.26em] text-[#8E8677]">
          A Journey Through Visual Stories
        </p>

        <h2 className="font-bebas mt-3 text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-[0.03em] uppercase text-[#F4E7CD] leading-[0.94] text-balance">
          Welcome to My <span className="text-[#FDC3A1]">Stories</span>
        </h2>

        <p className="font-inter text-xs sm:text-sm text-[#8E8677] mt-3 max-w-md mx-auto leading-relaxed">
          Drag any frame to explore, or open the archive to read the notes behind each photograph.
        </p>
      </div>

      {/* Interactive Fanned & Draggable Photo Deck */}
      <div className="relative mt-8 sm:mt-10 mb-8 flex h-[310px] sm:h-[300px] lg:h-[330px] w-full items-center justify-center">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isActive ? "visible" : "hidden"}
          >
            <div
              className="relative"
              style={{ width: cardSize, height: cardSize }}
            >
              {[...STORY_PHOTOS].reverse().map((photo) => {
                const xOffset =
                  tier === "mobile"
                    ? photo.xMobile
                    : tier === "tablet"
                      ? photo.xTablet
                      : photo.xDesktop;
                const yOffset =
                  tier === "mobile"
                    ? photo.yMobile
                    : tier === "tablet"
                      ? photo.yTablet
                      : photo.yDesktop;

                const originalIndex = STORY_PHOTOS.findIndex(
                  (p) => p.id === photo.id
                );

                return (
                  <motion.div
                    key={photo.id}
                    className="absolute left-0 top-0"
                    style={{ zIndex: photo.zIndex }}
                    variants={photoVariants}
                    custom={{
                      x: `${xOffset}px`,
                      y: `${yOffset}px`,
                      order: photo.order,
                    }}
                  >
                    <Photo
                      width={cardSize}
                      height={cardSize}
                      src={photo.src}
                      alt={photo.alt}
                      title={photo.title}
                      direction={photo.direction}
                      onOpen={() => openStoryAt(originalIndex)}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Primary Action Button (shadcn/button) */}
      <div className="flex w-full justify-center">
        <Button
          type="button"
          onClick={() => openStoryAt(0)}
          className="gap-2.5"
        >
          <span>View All Stories</span>
          <ArrowUpRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Editorial Stories Lightbox & Archive Modal */}
      {isArchiveOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Visual Stories Archive"
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1A1A1A]/92 backdrop-blur-md p-4 sm:p-6 md:p-10"
            onClick={() => setIsArchiveOpen(false)}
          >
            <div
              className="relative w-full max-w-5xl bg-[#232323] border border-[#3A3A3A] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Modal Header */}
              <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#3A3A3A]">
                <div className="flex items-center gap-2 text-xs font-inter uppercase tracking-[0.2em] text-[#8E8677]">
                  <span>Visual Stories</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#FDC3A1] tabular-nums">
                    0{selectedStoryIndex + 1} / 0{STORY_PHOTOS.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsArchiveOpen(false)}
                  aria-label="Close stories viewer"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#3A3A3A] text-[#F4E7CD] hover:border-[#FDC3A1] hover:text-[#FDC3A1] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Active Story Feature Split */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-7 bg-[#1A1A1A] aspect-square md:aspect-auto md:h-[440px] relative overflow-hidden">
                  <img
                    src={activeStory.src}
                    alt={activeStory.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-inter text-[#8E8677] uppercase tracking-wider">
                      <span>{activeStory.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeStory.date}</span>
                    </div>

                    <h3 className="font-bebas text-4xl sm:text-5xl tracking-[0.02em] uppercase text-[#F4E7CD] leading-none mt-3">
                      {activeStory.title}
                    </h3>

                    <p className="font-inter text-sm text-[#F9F9F9]/85 leading-relaxed mt-4">
                      {activeStory.caption}
                    </p>
                  </div>

                  {/* Thumbnail Strip + Prev/Next */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                      {STORY_PHOTOS.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedStoryIndex(idx)}
                          aria-label={`Select story ${item.title}`}
                          className={cn(
                            "aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer",
                            idx === selectedStoryIndex
                              ? "border-[#FDC3A1] ring-1 ring-[#FDC3A1]"
                              : "border-[#3A3A3A] opacity-55 hover:opacity-100"
                          )}
                        >
                          <img
                            src={item.src}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#3A3A3A]">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedStoryIndex(
                            (prev) =>
                              (prev - 1 + STORY_PHOTOS.length) %
                              STORY_PHOTOS.length
                          )
                        }
                        className="gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedStoryIndex(
                            (prev) => (prev + 1) % STORY_PHOTOS.length
                          )
                        }
                        className="gap-1.5"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

function getRandomNumberInRange(min, max) {
  if (min >= max) {
    throw new Error("Min value should be less than max value");
  }
  return Math.random() * (max - min) + min;
}

export const Photo = ({
  src,
  alt,
  title,
  className,
  direction = "left",
  width = 220,
  height = 220,
  onOpen,
  ...props
}) => {
  const [rotation] = useState(
    () => getRandomNumberInRange(1.5, 4.5) * (direction === "left" ? -1 : 1)
  );
  const [imgError, setImgError] = useState(false);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.15, zIndex: 9999 }}
      whileHover={{
        scale: 1.08,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{
        scale: 1.1,
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDC3A1] rounded-3xl"
      )}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      onPointerDown={(e) => {
        pointerDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const dx = Math.abs(e.clientX - pointerDownPos.current.x);
        const dy = Math.abs(e.clientY - pointerDownPos.current.y);
        if (dx < 6 && dy < 6 && typeof onOpen === "function") {
          onOpen();
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && typeof onOpen === "function") {
          e.preventDefault();
          onOpen();
        }
      }}
      draggable={false}
      tabIndex={0}
      role="button"
      aria-label={title ? `View story: ${title}` : alt}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-[#3A3A3A] bg-[#232323] shadow-xl transition-colors duration-200 hover:border-[#FDC3A1]/70">
        {!imgError ? (
          <motion.img
            className="h-full w-full rounded-3xl object-cover object-center pointer-events-none select-none"
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            draggable={false}
            {...props}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center bg-[#232323] text-[#F4E7CD]">
            <span className="font-bebas text-xl tracking-wide uppercase">
              {title || "Visual Story"}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PhotoGallery;
