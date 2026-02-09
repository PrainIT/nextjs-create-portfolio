"use client";

import { useRef, useState, useEffect } from "react";

interface FullWidthImageBlockProps {
  src: string;
  alt?: string;
  caption?: string;
}

/**
 * 처음엔 블로그 width, 스크롤할수록 부드럽게 브라우저 풀 width로 확장
 */
export default function FullWidthImageBlock({
  src,
  alt = "",
  caption,
}: FullWidthImageBlockProps) {
  const ref = useRef<HTMLFigureElement>(null);
  const [containerWidth, setContainerWidth] = useState(896); // max-w-4xl fallback
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const parent = el.parentElement;
      if (parent) setContainerWidth(parent.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement!);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress 0: 이미지 상단이 뷰포트 하단에 닿기 전
      // progress 1: 이미지 상단이 뷰포트 상단을 지나감
      let p = 0;
      if (rect.top <= vh) {
        p = Math.min(1, 1 - rect.top / vh);
      }
      setProgress(p);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const vw = typeof window !== "undefined" ? window.innerWidth : 896;
  const width = containerWidth + (vw - containerWidth) * progress;
  const marginLeft = (containerWidth - width) / 2;

  return (
    <figure
      ref={ref}
      className="my-8 overflow-hidden transition-none"
      style={{
        width: `${width}px`,
        marginLeft: `${marginLeft}px`,
        maxWidth: "none",
      }}
    >
      <div className="w-full h-full overflow-hidden">
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
