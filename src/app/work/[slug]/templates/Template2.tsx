"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { getYouTubeEmbedUrl } from "@/app/work/[slug]/utils/youtube";

interface Template2Props {
  category?: string;
  subCategory?: string;
  date?: string;
  title: string;
  description: string;
  videoUrl?: string;
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
      { label: "브랜디드 영상", value: "branded-video" },
      { label: "캠페인 영상", value: "campaign-video" },
      { label: "숏폼", value: "short-form" },
      { label: "웹예능", value: "web-entertainment" },
      { label: "스케치 영상", value: "sketch-video" },
      { label: "드라마", value: "drama" },
      { label: "인터뷰 영상", value: "interview-video" },
      { label: "모션그래픽", value: "motion-graphics" },
      { label: "뮤직비디오", value: "music-video" },
      { label: "LIVE", value: "live" },
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
}: Template2Props) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const categoryLabel = category ? categoryLabels[category] || category : "";
  const subCategoryLabel = category && subCategory
    ? getSubCategoryLabel(category, subCategory)
    : "";

  // 여러 비디오 URL이 있을 수 있으므로 배열로 처리
  const videoUrls = videoUrl ? [videoUrl] : [];

  const handlePrev = () => {
    setCurrentVideoIndex((prev) =>
      prev > 0 ? prev - 1 : videoUrls.length - 1
    );
  };

  const handleNext = () => {
    setCurrentVideoIndex((prev) =>
      prev < videoUrls.length - 1 ? prev + 1 : 0
    );
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
        <div className="text-grey-400 text-sm">
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

      {/* Video Carousel */}
      {videoUrls.length > 0 && (
        <div className="relative">
          <div className="relative w-full aspect-[9/16] rounded-lg overflow-hidden bg-grey-800">
            <iframe
              key={currentVideoIndex}
              src={getYouTubeEmbedUrl(videoUrls[currentVideoIndex])}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Carousel Controls */}
          {videoUrls.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-grey-900/80 hover:bg-grey-800 flex items-center justify-center transition-colors"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-grey-900/80 hover:bg-grey-800 flex items-center justify-center transition-colors"
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
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {videoUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentVideoIndex
                        ? "bg-white w-6"
                        : "bg-grey-500"
                    }`}
                    aria-label={`비디오 ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

