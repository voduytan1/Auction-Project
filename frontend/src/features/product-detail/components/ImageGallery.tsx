import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

interface ImageGalleryProps {
  mainImage: string;
  images: string[];
  productName: string;
}

export function ImageGallery({
  mainImage,
  images,
  productName,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null
  );
  const allImages = [mainImage, ...images];

  const goToPrevious = () => {
    setSlideDirection("right");
    setTimeout(() => {
      setSelectedImage((prev) =>
        prev === 0 ? allImages.length - 1 : prev - 1
      );
      setSlideDirection(null);
    }, 50);
  };

  const goToNext = () => {
    setSlideDirection("left");
    setTimeout(() => {
      setSelectedImage((prev) =>
        prev === allImages.length - 1 ? 0 : prev + 1
      );
      setSlideDirection(null);
    }, 50);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 group cursor-pointer">
        <div
          key={selectedImage}
          className={`h-full w-full transition-all duration-500 ease-in-out ${
            slideDirection === "left"
              ? "animate-slide-in-left"
              : slideDirection === "right"
              ? "animate-slide-in-right"
              : "animate-fade-in"
          }`}
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={allImages[selectedImage]}
            alt={`${productName} - ${selectedImage + 1}`}
            className="h-full w-full object-contain bg-white"
          />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white active:scale-95 transition-all z-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white active:scale-95 transition-all z-10"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-xs sm:text-sm text-white font-medium">
          {selectedImage + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails - Responsive Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
              selectedImage === index
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-slate-300"
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-cover bg-white"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 bg-black/95 border-none">
          <DialogClose className="absolute right-2 top-2 z-50 rounded-full bg-white/90 p-2 hover:bg-white transition-colors">
            <X className="h-5 w-5" />
          </DialogClose>

          <div className="relative flex items-center justify-center min-h-[60vh]">
            <img
              src={allImages[selectedImage]}
              alt={`${productName} - ${selectedImage + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />

            {/* Lightbox Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg hover:bg-white active:scale-95 transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg hover:bg-white active:scale-95 transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Image counter for lightbox */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium">
                  {selectedImage + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
