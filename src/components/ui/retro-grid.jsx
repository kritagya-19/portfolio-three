import { cn } from "@/lib/utils";

export function RetroGrid({ className, angle = 65 }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden opacity-55 [perspective:200px]",
        className
      )}
      style={{ "--grid-angle": `${angle}deg` }}
    >
      {/* Animated Perspective Grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "animate-grid motion-reduce:animate-none",
            "[background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]",
            "[background-image:linear-gradient(to_right,rgba(244,231,205,0.16)_1px,transparent_0),linear-gradient(to_bottom,rgba(244,231,205,0.16)_1px,transparent_0)]"
          )}
        />
      </div>

      {/* Subtle Horizon Vignette matching #1A1A1A */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-transparent to-transparent to-85%" />
    </div>
  );
}

export default RetroGrid;
