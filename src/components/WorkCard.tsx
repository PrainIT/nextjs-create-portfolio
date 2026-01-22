"use client";

import { useRef, useEffect, useState } from "react";
import { getYouTubeEmbedUrl, isYouTubeShorts } from "@/components/work-utils/youtube";

interface WorkCardProps {
  id: number;
  title: string;
  tags: string[];
  image?: string;
  videoUrl?: string; // YouTube URL (영상 표시용)
  logo?: React.ReactNode;
  isSearchMode?: boolean;
  forceSquare?: boolean; // branded에서 무조건 정사각형으로 표시
  forceFullHeight?: boolean; // content에서 무조건 h-full로 표시
  disableVideoInteraction?: boolean; // 유튜브 재생 버튼 숨김 및 클릭 방지
  contentType?: number; // 1: 유튜브, 2: 숏폼
  onTagClick?: (tag: string) => void;
}

export default function WorkCard({
  id,
  title,
  tags,
  image,
  videoUrl,
  logo,
  isSearchMode = false,
  forceSquare = false,
  forceFullHeight = false,
  disableVideoInteraction = false,
  contentType,
  onTagClick,
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
        className={`relative w-full bg-gradient-to-br from-grey-700 to-grey-900 rounded-2xl overflow-hidden ${
          !image && !videoUrl
            ? "aspect-square"
            : forceSquare || (!isSearchMode && !forceFullHeight)
              ? "aspect-square"
              : ""
        }`}
        style={
          !forceSquare &&
          !forceFullHeight &&
          isSearchMode &&
          !image &&
          !videoUrl
            ? {
                minHeight: "200px",
                height: `${200 + (id % 3) * 100}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }
            : contentType === 1 && image
            ? {
                aspectRatio: '16 / 9'
              }
            : contentType === 2 && image
            ? {
                aspectRatio: '9 / 16'
              }
            : {}
        }
      >
        {videoUrl ? (
          <div className={`relative w-full ${isYouTubeShorts(videoUrl) ? "aspect-[9/16]" : "aspect-video"}`}>
            <iframe
              src={getYouTubeEmbedUrl(videoUrl, { disableControls: disableVideoInteraction })}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={`absolute inset-0 w-full h-full rounded-2xl ${
                disableVideoInteraction ? "pointer-events-none" : ""
              }`}
            />
          </div>
        ) : image ? (
          <img
            src={image}
            alt={title}
            className={`w-full ${
              forceSquare || (!isSearchMode && !forceFullHeight)
                ? "aspect-square h-full"
                : contentType === 1 || contentType === 2
                ? "h-full"
                : "h-auto"
            } object-cover rounded-2xl`}
          />
        ) : (
          <div className="text-grey-500 text-sm flex items-center justify-center h-full">
            이미지 영역
          </div>
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
              <button
                key={`${tag}-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="flex-shrink-0 px-2 py-1 text-xs text-grey-400 bg-grey-700 rounded whitespace-nowrap hover:bg-grey-600 hover:text-grey-200 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
