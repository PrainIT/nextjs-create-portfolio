"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { getYouTubeEmbedUrl } from "@/components/work-utils/youtube";

interface Template2Props {
  category?: string;
  subCategory?: string;
  date?: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoUrls?: string[];
}

const categoryLabels: Record<string, string> = {
  video: "영상 콘텐츠",
  image: "이미지 콘텐츠",
  photo: "사진 콘텐츠",
};

const workCategories = [
  {
    title: "영상 콘텐츠",
    items: [
      { label: "유튜브", value: "youtube" },
      { label: "숏폼", value: "short-form" },
    ],
  },
  {
    title: "이미지 콘텐츠",
    items: [
      { label: "SNS 콘텐츠", value: "sns-content" },
      { label: "브랜딩", value: "branding" },
      { label: "인포그래픽", value: "infographic" },
      { label: "포스터", value: "poster" },
      { label: "배너", value: "banner" },
      { label: "카드뉴스", value: "card-news" },
      { label: "키비주얼", value: "key-visual" },
      { label: "인쇄물", value: "print" },
      { label: "상세페이지", value: "detail-page" },
      { label: "패키지", value: "package" },
    ],
  },
  {
    title: "사진 콘텐츠",
    items: [
      { label: "제품", value: "product" },
      { label: "인물", value: "portrait" },
      { label: "스케치", value: "sketch" },
    ],
  },
] as const;

function getSubCategoryLabel(category: string, subCategory: string) {
  const categoryGroup = workCategories.find(
    (cat) => cat.title === categoryLabels[category] || false
  );
  return (
    categoryGroup?.items.find((item) => item.value === subCategory)?.label ||
    subCategory
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR");
}

export default function Template2({
  category,
  subCategory,
  date,
  title,
  description,
  videoUrl,
  videoUrls,
}: Template2Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryLabel = category ? categoryLabels[category] || category : "";
  const subCategoryLabel =
    category && subCategory ? getSubCategoryLabel(category, subCategory) : "";

  // 유튜브는 단일, 숏폼은 배열로 처리
  const allVideoUrls =
    videoUrls && videoUrls.length > 0
      ? videoUrls.filter((url) => url && url.trim()) // 빈 URL 필터링
      : videoUrl && videoUrl.trim()
        ? [videoUrl]
        : [];

  // 유효한 URL만 필터링
  const validUrls = allVideoUrls.filter((url) => {
    const embedUrl = getYouTubeEmbedUrl(url);
    return embedUrl && embedUrl.length > 0;
  });

  const handlePrev = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth / 3; // 3개 중 1개씩 스크롤
    container.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth / 3; // 3개 중 1개씩 스크롤
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      {/* 카테고리 / Date (우측 정렬) */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-brand text-sm">
          {categoryLabel}
          {subCategoryLabel && ` > ${subCategoryLabel}`}
        </div>
        {date && (
          <div className="text-grey-400 text-sm">{formatDate(date)}</div>
        )}
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>

      {/* Description */}
      {description && (
        <p className="text-grey-300 leading-relaxed mb-8 whitespace-pre-line">
          {description}
        </p>
      )}

      {/* Video Carousel - 숏폼인 경우 */}
      {subCategory === "short-form" && validUrls.length > 0 && (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              scrollSnapType: "x mandatory",
            }}
          >
            {validUrls.map((url, index) => {
              const embedUrl = getYouTubeEmbedUrl(url);
              if (!embedUrl) return null;
              return (
                <div
                  key={index}
                  className="flex-shrink-0 w-[calc(33.333%-0.67rem)] min-w-[calc(33.333%-0.67rem)]"
                  style={{
                    scrollSnapAlign: "start",
                  }}
                >
                  <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-grey-800">
                    <iframe
                      src={embedUrl}
                      title={`${title} - Video ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Controls */}
          {validUrls.length > 3 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-grey-900/80 hover:bg-grey-800 flex items-center justify-center transition-colors z-10"
                aria-label="이전 비디오"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-grey-900/80 hover:bg-grey-800 flex items-center justify-center transition-colors z-10"
                aria-label="다음 비디오"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* Video - 유튜브 (단일) */}
      {subCategory === "youtube" && validUrls.length > 0 && (
        <div className="relative">
          <div className="relative w-full aspect-[9/16] rounded-lg overflow-hidden bg-grey-800">
            <iframe
              src={getYouTubeEmbedUrl(validUrls[0])}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

