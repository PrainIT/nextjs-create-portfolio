"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageSliderBlockProps {
  images: Array<{ image?: unknown; caption?: string }>;
  urlForImage: (source: unknown) => string;
}

export default function ImageSliderBlock({
  images,
  urlForImage,
}: ImageSliderBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validImages = (images ?? []).filter((i): i is { image: unknown; caption?: string } => !!i?.image);
  if (validImages.length === 0) return null;

  const goPrev = () => {
    setCurrentIndex((i) => (i <= 0 ? validImages.length - 1 : i - 1));
  };
  const goNext = () => {
    setCurrentIndex((i) => (i >= validImages.length - 1 ? 0 : i + 1));
  };

  return (
    <figure className="my-8">
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlForImage(validImages[currentIndex].image)}
              alt={validImages[currentIndex].caption || ""}
              className="w-full h-full object-contain"
            />
          </motion.div>
        </AnimatePresence>
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="이전"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="다음"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {validImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`${i + 1}번 이미지`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {validImages[currentIndex]?.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-400">
          {validImages[currentIndex].caption}
        </figcaption>
      )}
    </figure>
  );
}
