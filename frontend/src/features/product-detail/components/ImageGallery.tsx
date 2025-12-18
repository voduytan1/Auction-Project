import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const allImages = [mainImage, ...images];

  const goToPrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-slate-100">
        <img
          src={allImages[selectedImage]}
          alt={`${productName} - ${selectedImage + 1}`}
          className="h-full w-full object-cover"
        />

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
          {selectedImage + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
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
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
