"use client";

import { type SanityDocument } from "next-sanity";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Template1 from "@/components/work-templates/Template1";
import Template2 from "@/components/work-templates/Template2";
import Template3 from "@/components/work-templates/Template3";
import Template4 from "@/components/work-templates/Template4";
import SearchBar from "@/components/SearchBar";

interface Template {
  templateType: number;
  category?: string;
  subCategory?: string;
  date?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  videoUrls?: string[];
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
  basePath: string; // "/branded" 또는 "/content"
  pageName?: string; // 페이지 이름 (기본값: basePath에 따라 결정)
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
  basePath,
  pageName,
}: WorkDetailClientProps) {
  const router = useRouter();
  const templateRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);
  const [showStickyNav, setShowStickyNav] = useState(false);

  const displayPageName = pageName || (basePath === "/branded" ? "BRANDED" : "CONTENT");

  const handleBack = () => {
    router.push(basePath);
  };

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

  // 스크롤 감지로 activeTemplate 업데이트 및 sticky nav 표시
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // 첫 화면을 벗어났는지 확인 (스크롤이 100px 이상)
      setShowStickyNav(window.scrollY > 700);

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
            videoUrls={undefined}
            images={template.images || []}
          />
        );
      case 2:
        return (
          <Template2
            key={index}
            {...commonProps}
            videoUrl={undefined}
            videoUrls={template.videoUrls}
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
        <div className="w-64 flex-shrink-0 pl-8 py-8 mr-8">
          <div className="flex flex-col gap-8">
            {/* HOME | PageName */}
            <div className="flex items-center gap-2 text-sm text-grey-400">
              <Link href="/" className="hover:text-grey-200 transition-colors">
                HOME
              </Link>
              <span className="text-grey-600">|</span>
              <span className="text-grey-200 font-medium">{displayPageName}</span>
            </div>

            {/* 뒤로가기 버튼 */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1 }}
              whileHover={{ x: -5 }}
              whileTap={{ x: -2 }}
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-grey-200 hover:text-grey-100 cursor-pointer transition-colors"
            >
              <svg
                width="28"
                height="28"
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
            </motion.button>

            {/* Title */}
            {work.title && (
              <div className="text-white font-bold text-lg break-words">
                {work.title}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {/* Client */}
              {work.client && (
                <div className="text-sm text-grey-500">
                  <span className="font-bold">Client</span> {work.client}
                </div>
              )}

              {/* Work */}
              {work.category && (
                <div className="text-sm text-grey-500">
                  <span className="font-bold">Work</span>{" "}
                  {categoryLabels[work.category] || work.category}
                  {work.subCategory &&
                    ` > ${getSubCategoryLabel(work.category, work.subCategory)}`}
                </div>
              )}

              {/* Data */}
              {work.publishedAt && (
                <div className="text-sm text-grey-500">
                  <span className="font-bold">Data</span>{" "}
                  {formatDate(work.publishedAt)}
                </div>
              )}
            </div>

            {/* Award */}
            {work.award && (work.award.title || work.award.description) && (
              <div className="mb-4">
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
          {/* Template Navigation */}
          {work.templates && work.templates.length > 0 && (
            <div className="sticky top-[0%] flex flex-col gap-2 py-2.5">
              {work.templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => scrollToTemplate(index)}
                  className={`w-full text-center px-4 py-2 rounded-full text-xl font-medium transition-all ${
                    activeTemplate === index
                      ? "bg-brand text-white border-none"
                      : "border border-grey-700 text-grey-700 hover:text-white hover:border-white"
                  }`}
                >
                  Template {template.templateType}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 콘텐츠 영역 - 나머지 공간 */}
        <div className="flex-1 pr-8 py-8">
          {/* 검색창 - 오른쪽 위 */}
          {/* <div className="flex justify-end mb-8">
            <SearchBar placeholder="SEARCH" />
          </div> */}
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
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
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

