"use client";

import { type SanityDocument } from "next-sanity";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Template1 from "./templates/Template1";
import Template2 from "./templates/Template2";
import Template3 from "./templates/Template3";
import Template4 from "./templates/Template4";

interface Template {
  templateType: number;
  category?: string;
  subCategory?: string;
  date?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  images?: string[];
}

interface WorkDetailClientProps {
  work: SanityDocument & {
    client?: string;
    summary?: string;
    award?: {
      title?: string;
      description?: string;
    };
    templates?: Template[];
  };
  workImageUrl: string | null;
}

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
    title: "디자인 콘텐츠",
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
  {
    title: "AI 콘텐츠",
    items: [],
  },
] as const;

const categoryLabels: Record<string, string> = {
  video: "영상 콘텐츠",
  design: "디자인 콘텐츠",
  photo: "사진 콘텐츠",
  ai: "AI 콘텐츠",
};

export default function WorkDetailClient({
  work,
  workImageUrl,
}: WorkDetailClientProps) {
  const templateRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);

  const getSubCategoryLabel = (category: string, subCategory: string) => {
    const categoryGroup = workCategories.find(
      (cat) => cat.title === categoryLabels[category] || false
    );
    return (
      categoryGroup?.items.find((item) => item.value === subCategory)?.label ||
      subCategory
    );
  };

  const scrollToTemplate = (templateIndex: number) => {
    const template = work.templates?.[templateIndex];
    if (template && templateRefs.current[templateIndex]) {
      templateRefs.current[templateIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // 스크롤 감지로 activeTemplate 업데이트
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      work.templates?.forEach((_, index) => {
        const element = templateRefs.current[index];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveTemplate(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 실행

    return () => window.removeEventListener("scroll", handleScroll);
  }, [work.templates]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  const renderTemplate = (template: Template, index: number) => {
    const commonProps = {
      category: template.category,
      subCategory: template.subCategory,
      date: template.date,
      title: template.title || "",
      description: template.description || "",
    };

    switch (template.templateType) {
      case 1:
        return (
          <Template1
            key={index}
            {...commonProps}
            videoUrl={template.videoUrl}
            images={template.images || []}
          />
        );
      case 2:
        return (
          <Template2
            key={index}
            {...commonProps}
            videoUrl={template.videoUrl}
          />
        );
      case 3:
        return (
          <Template3
            key={index}
            {...commonProps}
            images={template.images || []}
          />
        );
      case 4:
        return (
          <Template4
            key={index}
            {...commonProps}
            images={template.images || []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main
      className="w-full relative flex flex-col"
      style={{ minHeight: "100vh" }}
    >
      {/* 상단 선 */}
      <div className="w-full h-px bg-grey-700" />

      {/* NavBar와 콘텐츠 영역 - flex row */}
      <div className="flex-1 flex">
        {/* NavBar - 고정 너비 */}
        <div className="w-64 flex-shrink-0 pl-8 py-8">
          <div className="flex flex-col gap-8">
            {/* Title */}
            {work.title && (
              <div>
                <div className="text-sm text-grey-500 mb-2">Title</div>
                <div className="text-white font-medium">{work.title}</div>
              </div>
            )}

            {/* Client */}
            {work.client && (
              <div>
                <div className="text-sm text-grey-500 mb-2">Client</div>
                <div className="text-white">{work.client}</div>
              </div>
            )}

            {/* Work */}
            {work.category && (
              <div>
                <div className="text-sm text-grey-500 mb-2">Work</div>
                <div className="text-white">
                  {categoryLabels[work.category] || work.category}
                  {work.subCategory &&
                    ` > ${getSubCategoryLabel(work.category, work.subCategory)}`}
                </div>
              </div>
            )}

            {/* Data */}
            {work.publishedAt && (
              <div>
                <div className="text-sm text-grey-500 mb-2">Data</div>
                <div className="text-white">{formatDate(work.publishedAt)}</div>
              </div>
            )}

            {/* Template Navigation */}
            {work.templates && work.templates.length > 0 && (
              <div>
                <div className="text-sm text-grey-500 mb-4">
                  Template Navigation
                </div>
                <div className="flex flex-col gap-2">
                  {work.templates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToTemplate(index)}
                      className={`text-left text-sm transition-colors ${
                        activeTemplate === index
                          ? "text-white font-medium"
                          : "text-grey-400 hover:text-grey-200"
                      }`}
                    >
                      Template {template.templateType}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Award */}
            {work.award && (work.award.title || work.award.description) && (
              <div>
                <div className="text-sm text-grey-500 mb-2">Award</div>
                {work.award.title && (
                  <div className="text-white font-bold mb-1">
                    {work.award.title}
                  </div>
                )}
                {work.award.description && (
                  <div className="text-grey-400 text-sm">
                    {work.award.description}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 콘텐츠 영역 - 나머지 공간 */}
        <div className="flex-1 pr-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            {/* Summary */}
            {work.summary && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-16"
              >
                <div className="text-sm text-grey-500 mb-4">Summary</div>
                <div className="text-white leading-relaxed whitespace-pre-line">
                  {work.summary}
                </div>
              </motion.div>
            )}

            {/* Templates */}
            {work.templates && work.templates.length > 0 && (
              <div className="space-y-24">
                {work.templates.map((template, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      templateRefs.current[index] = el;
                    }}
                  >
                    {renderTemplate(template, index)}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 하단 선 */}
      <div className="w-full h-px bg-grey-700 mt-12 mb-12" />
    </main>
  );
}
