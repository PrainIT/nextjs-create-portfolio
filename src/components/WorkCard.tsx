"use client";

import { useRef, useEffect, useState } from "react";

interface WorkCardProps {
  id: number;
  title: string;
  tags: string[];
  image?: string;
  logo?: React.ReactNode;
  isSearchMode?: boolean;
}

export default function WorkCard({
  id,
  title,
  tags,
  image,
  logo,
  isSearchMode = false,
}: WorkCardProps) {
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const [needsAnimation, setNeedsAnimation] = useState(false);

  useEffect(() => {
    if (tagsContainerRef.current) {
      const container = tagsContainerRef.current;
      const containerWidth = container.offsetWidth;
      const tagsWidth = container.scrollWidth;
      // 태그가 컨테이너를 넘어가면 애니메이션 적용
      setNeedsAnimation(tagsWidth > containerWidth);
    }
  }, [tags]);

  // 태그를 2번 복제해서 무한 스크롤 효과
  const duplicatedTags = needsAnimation ? [...tags, ...tags] : tags;

  return (
    <div className="overflow-hidden flex flex-col">
      {/* 이미지/로고 영역 */}
      <div
        className={`relative w-full bg-gradient-to-br from-grey-700 to-grey-900 flex items-center justify-center rounded-2xl ${
          isSearchMode ? "" : "aspect-square"
        }`}
        style={
          isSearchMode
            ? {
                minHeight: "200px",
                height: image ? "auto" : `${200 + (id % 3) * 100}px`,
              }
            : {}
        }
      >
        {image ? (
          <img
            src={image}
            alt={title}
            className={`w-full ${isSearchMode ? "h-auto" : "h-full"} object-cover rounded-2xl`}
          />
        ) : (
          <div className="text-grey-500 text-sm">이미지 영역</div>
        )}
        {logo && (
          <div className="absolute inset-0 flex items-center justify-center">
            {logo}
          </div>
        )}
      </div>

      {/* 타이틀 */}
      <div className="p-4">
        <h3 className="text-white text-left font-medium mb-3 break-words">
          {title}
        </h3>

        {/* 태그 영역 */}
        <div ref={tagsContainerRef} className="relative overflow-hidden w-full">
          <div
            className={`flex gap-2 ${needsAnimation ? "animate-slide-infinite" : ""}`}
            style={{ width: "fit-content" }}
          >
            {duplicatedTags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="flex-shrink-0 px-2 py-1 text-xs text-grey-400 bg-grey-700 rounded whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
