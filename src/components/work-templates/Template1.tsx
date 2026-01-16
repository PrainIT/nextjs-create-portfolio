"use client";

import { motion } from "framer-motion";
import { getYouTubeEmbedUrl } from "@/components/work-utils/youtube";

interface Template1Props {
  category?: string;
  subCategory?: string;
  date?: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoUrls?: string[];
  images: string[];
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

export default function Template1({
  category,
  subCategory,
  date,
  title,
  description,
  videoUrl,
  videoUrls,
  images,
}: Template1Props) {
  const categoryLabel = category ? categoryLabels[category] || category : "";
  const subCategoryLabel =
    category && subCategory ? getSubCategoryLabel(category, subCategory) : "";

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

      {/* Video - 유튜브 (단일) */}
      {videoUrl && (
        <div className="mb-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <iframe
              src={getYouTubeEmbedUrl(videoUrl)}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Video - 숏폼 (여러 개) */}
      {videoUrls && videoUrls.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            {videoUrls
              .filter((url) => url && getYouTubeEmbedUrl(url)) // 유효한 URL만 필터링
              .map((url, index) => {
                const embedUrl = getYouTubeEmbedUrl(url);
                if (!embedUrl) return null;
                return (
                  <div
                    key={index}
                    className="relative w-full aspect-video rounded-lg overflow-hidden"
                  >
                    <iframe
                      src={embedUrl}
                      title={`${title} - Video ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Image Grid (3x2) */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.slice(0, 6).map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative aspect-[4/3] rounded-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`${title} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

