import { PhotoGallery } from "@/components/ui/gallery";

export default function StoriesSection({ revealed }) {
  return (
    <section
      id="stories"
      aria-label="Visual Stories"
      className="relative w-full h-full min-h-[100svh] flex items-center justify-center bg-transparent text-[#F9F9F9] overflow-hidden"
    >
      <PhotoGallery revealed={revealed} />
    </section>
  );
}
