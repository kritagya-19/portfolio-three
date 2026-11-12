import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

// Register GSAP Plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

const MENU_ITEMS = [
  { label: "Home", href: "#hero", shape: "1", targetId: "hero" },
  { label: "Tech Stack", href: "#tech-stack", shape: "2", targetId: "tech-stack" },
  { label: "Philosophy", href: "#philosophy", shape: "3", targetId: "philosophy" },
  { label: "Projects", href: "#projects", shape: "4", targetId: "projects", fade: true },
  { label: "Achievements", href: "#achievements", shape: "5", targetId: "achievements" },
  { label: "Contact", href: "https://www.yashtrivedi.dev", shape: "1", external: true },
];

export function Component({ onOpenChange }) {
  // Separate refs for the Hero-scoped top-right trigger and the portaled fullscreen drawer
  const triggerRef = useRef(null);
  const drawerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const notifyOpenChange = useCallback(
    (nextOpen) => {
      setIsMenuOpen(nextOpen);
      if (typeof onOpenChange === "function") {
        onOpenChange(nextOpen);
      }
    },
    [onOpenChange]
  );

  // Initial Setup & Hover Effects for ambient shapes inside the drawer
  useEffect(() => {
    const drawerEl = drawerRef.current;
    if (!drawerEl) return;

    // Register custom easing safely without mutating global gsap.defaults
    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
      }
    } catch (e) {
      console.warn("CustomEase failed to load, falling back to default.", e);
    }

    const ctx = gsap.context(() => {
      // 1. Arrow Animation (kept safe if arrow element exists)
      const arrowLine = drawerEl.querySelector(".arrow-line");
      if (arrowLine) {
        const pathLength = arrowLine.getTotalLength();
        gsap.set(arrowLine, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        const arrowTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        arrowTl
          .to(arrowLine, { strokeDashoffset: 0, duration: 1, ease: "power2.out" })
          .to({}, { duration: 1.2 })
          .to(arrowLine, { strokeDashoffset: -pathLength, duration: 0.6, ease: "power2.in" })
          .set(arrowLine, { strokeDashoffset: pathLength });
      }

      // 2. Ambient Shape Hover Choreography
      const menuItems = drawerEl.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = drawerEl.querySelector(".ambient-background-shapes");

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer
          ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`)
          : null;

        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          if (shapesContainer) {
            shapesContainer.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
          }
          shape.classList.add("active");

          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              overwrite: "auto",
            }
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);

        item._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, drawerEl);

    return () => {
      ctx.revert();
      const items = drawerEl.querySelectorAll(".menu-list-item[data-shape]");
      items.forEach((item) => item._cleanup && item._cleanup());
    };
  }, []);

  // Menu Open/Close Kinetic Animation Effect
  useEffect(() => {
    if (!triggerRef.current || !drawerRef.current) return;

    const mainEase = gsap.parseEase("main") ? "main" : "power2.out";

    const ctx = gsap.context(() => {
      const navWrap = drawerRef.current.querySelector(".nav-overlay-wrapper");
      const menu = drawerRef.current.querySelector(".menu-content");
      const overlay = drawerRef.current.querySelector(".overlay");
      const bgPanels = drawerRef.current.querySelectorAll(".backdrop-layer");
      const menuLinks = drawerRef.current.querySelectorAll(".nav-link");
      const fadeTargets = drawerRef.current.querySelectorAll("[data-menu-fade]");

      const menuButton = triggerRef.current.querySelector(".nav-close-btn");
      const menuButtonTexts = menuButton?.querySelectorAll("p") || [];

      const tl = gsap.timeline({
        defaults: { ease: mainEase, duration: 0.7 },
      });

      if (isMenuOpen) {
        if (navWrap) navWrap.setAttribute("data-nav", "open");

        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.08 })
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(
            bgPanels,
            { xPercent: 101 },
            { xPercent: 0, stagger: 0.12, duration: 0.575 },
            "<"
          )
          .fromTo(
            menuLinks,
            { yPercent: 140, rotate: 10 },
            { yPercent: 0, rotate: 0, stagger: 0.05 },
            "<+=0.35"
          );

        if (fadeTargets.length) {
          tl.fromTo(
            fadeTargets,
            { autoAlpha: 0, yPercent: 50 },
            { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" },
            "<+=0.2"
          );
        }
      } else {
        if (navWrap) navWrap.setAttribute("data-nav", "closed");

        tl.to(overlay, { autoAlpha: 0 })
          .to(menu, { xPercent: 120 }, "<")
          .to(menuButtonTexts, { yPercent: 0 }, "<")
          .set(navWrap, { display: "none" });
      }
    });

    return () => ctx.revert();
  }, [isMenuOpen]);

  // Escape key & body scroll lock while open
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        notifyOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    const prevOverflow = document.body.style.overflow;
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [isMenuOpen, notifyOpenChange]);

  const toggleMenu = () => notifyOpenChange(!isMenuOpen);
  const closeMenu = () => notifyOpenChange(false);

  const handleLinkClick = (e, item) => {
    if (item.external) {
      closeMenu();
      return;
    }

    e.preventDefault();
    closeMenu();

    // Allow body scroll unlock & close transition to start before smooth scrolling
    requestAnimationFrame(() => {
      if (item.targetId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const targetEl = document.getElementById(item.targetId);
      if (!targetEl) return;

      const spacer = targetEl.closest(".pin-spacer") || targetEl;
      const baseTop = spacer.getBoundingClientRect().top + window.scrollY;

      if (item.targetId === "philosophy") {
        // Land with the Philosophy statement cleanly pinned & sharp
        window.scrollTo({ top: baseTop + 1400, behavior: "smooth" });
      } else if (item.targetId === "projects") {
        // Land as the project cards enter over the Philosophy section
        window.scrollTo({ top: baseTop + 2150, behavior: "smooth" });
      } else if (item.targetId === "achievements") {
        // Land right as Card 6 clears and Achievements occupies the viewport
        window.scrollTo({ top: baseTop + 5900, behavior: "smooth" });
      } else {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  const drawerContent = (
    <section ref={drawerRef} className="fullscreen-menu-container">
      <div data-nav="closed" className="nav-overlay-wrapper">
        <div className="overlay" onClick={closeMenu}></div>
        <nav className="menu-content" aria-label="Primary Portfolio Navigation">
          <div className="menu-bg">
            <div className="backdrop-layer first"></div>
            <div className="backdrop-layer second"></div>
            <div className="backdrop-layer"></div>

            {/* Ambient geometric shapes in portfolio cream & peach palette */}
            <div className="ambient-background-shapes">
              {/* Shape 1: Floating circles */}
              <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(244,231,205,0.06)" />
                <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(253,195,161,0.08)" />
                <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(232,220,194,0.05)" />
                <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(253,195,161,0.07)" />
              </svg>

              {/* Shape 2: Wave pattern */}
              <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                <path
                  className="shape-element"
                  d="M0 200 Q100 100, 200 200 T 400 200"
                  stroke="rgba(253,195,161,0.09)"
                  strokeWidth="60"
                  fill="none"
                />
                <path
                  className="shape-element"
                  d="M0 280 Q100 180, 200 280 T 400 280"
                  stroke="rgba(244,231,205,0.06)"
                  strokeWidth="40"
                  fill="none"
                />
              </svg>

              {/* Shape 3: Grid dots */}
              <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(253,195,161,0.14)" />
                <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(244,231,205,0.12)" />
                <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(232,220,194,0.12)" />
                <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(253,195,161,0.14)" />
                <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(244,231,205,0.1)" />
                <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(253,195,161,0.12)" />
                <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(232,220,194,0.1)" />
                <circle className="shape-element" cx="50" cy="250" r="10" fill="rgba(253,195,161,0.14)" />
                <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(244,231,205,0.12)" />
                <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(232,220,194,0.12)" />
                <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(253,195,161,0.14)" />
                <circle className="shape-element" cx="100" cy="350" r="6" fill="rgba(244,231,205,0.12)" />
                <circle className="shape-element" cx="200" cy="350" r="6" fill="rgba(253,195,161,0.12)" />
                <circle className="shape-element" cx="300" cy="350" r="6" fill="rgba(232,220,194,0.12)" />
              </svg>

              {/* Shape 4: Organic blobs */}
              <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                <path
                  className="shape-element"
                  d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                  fill="rgba(244,231,205,0.06)"
                />
                <path
                  className="shape-element"
                  d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
                  fill="rgba(253,195,161,0.07)"
                />
              </svg>

              {/* Shape 5: Diagonal lines */}
              <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(253,195,161,0.08)" strokeWidth="30" />
                <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(244,231,205,0.06)" strokeWidth="25" />
                <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(232,220,194,0.05)" strokeWidth="20" />
              </svg>
            </div>
          </div>

          <div className="menu-content-wrapper">
            <ul className="menu-list">
              {MENU_ITEMS.map((item) => (
                <li key={item.label} className="menu-list-item" data-shape={item.shape}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={(e) => handleLinkClick(e, item)}
                    className="nav-link w-inline-block"
                  >
                    <p
                      className="nav-link-text"
                      {...(item.fade ? { "data-menu-fade": "" } : {})}
                    >
                      {item.label}
                    </p>
                    <div className="nav-link-hover-bg"></div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </section>
  );

  return (
    <>
      <div ref={triggerRef} className="site-header-wrapper">
        <header className="header">
          <nav className="nav-row">
            <div className="nav-row__right">
              <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                data-open={isMenuOpen ? "true" : "false"}
                className="nav-close-btn"
                onClick={toggleMenu}
                style={{ pointerEvents: "auto" }}
              >
                <div className="menu-button-text">
                  <p className="p-large">Menu</p>
                  <p className="p-large">Close</p>
                </div>
              </button>
            </div>
          </nav>
        </header>
      </div>

      {typeof document !== "undefined" ? createPortal(drawerContent, document.body) : null}
    </>
  );
}

export default Component;

