"use client";

import { useRef, useState, useEffect } from "react";

interface FullWidthImageBlockProps {
  src: string;
  alt?: string;
  caption?: string;
}

/**
 * 처음엔 블로그 width 내부, 스크롤하면 브라우저 풀 width로 확장되는 이미지
 */
export default function FullWidthImageBlock({
  src,
  alt = "",
  caption,
}: FullWidthImageBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 뷰포트에 들어오면(스크롤 시) 풀 width로 확장
        setIsExpanded(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "-10% 0px -10% 0px",
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className={`my-8 transition-all duration-500 ${
        isExpanded
          ? "w-[100vw] relative left-1/2 -translate-x-1/2"
          : "w-full max-w-4xl mx-auto"
      }`}
    >
      <div className="overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
