"use client";

import { type SanityDocument } from "next-sanity";
import { motion } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Template1 from "@/components/work-templates/Template1";
import Template2 from "@/components/work-templates/Template2";
import Template3 from "@/components/work-templates/Template3";
import Template4 from "@/components/work-templates/Template4";
import RelationContentCard from "@/components/RelationContentCard";

interface Content {
  _id?: string;
  contentType: number;
  category?: string;
  subCategory?: string;
  date?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  videoUrls?: string[];
  images?: string[];
  content2Role?: 'base' | 'attach' | null;
  attachToContentId?: string | null;
}

interface RelatedVideo {
  id: string;
  title: string;
  thumbnail?: string;
  date?: string;
  slug?: string;
  onClick?: () => void;
}

interface BrandedDetailClientProps {
  work: SanityDocument & {
    client?: string;
    summary?: string;
    clientLogoUrl?: string | null;
    award?: {
      title?: string;
      description?: string;
    };
    contents?: Content[];
  };
  workImageUrl: string | null;
  relatedVideos?: RelatedVideo[];
}

const BrandedCategories = [
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
] as const;

const categoryLabels: Record<string, string> = {
  video: "영상 콘텐츠",
  design: "디자인 콘텐츠",
  photo: "사진 콘텐츠",
};

const BASE_PATH = "/branded";

export default function WorkDetailClient({
  work,
  workImageUrl,
  relatedVideos = [],
}: BrandedDetailClientProps) {
  const router = useRouter();
  const contentRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [activeContent, setActiveContent] = useState<number | null>(null);
  const [showStickyNav, setShowStickyNav] = useState(false);

  const handleBack = () => {
    router.push(BASE_PATH);
  };

  const getSubCategoryLabel = (category: string, subCategory: string) => {
    const categoryGroup = BrandedCategories.find(
      (cat) => cat.title === categoryLabels[category] || false
    );
    return (
      categoryGroup?.items.find((item) => item.value === subCategory)?.label ||
      subCategory
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  // Content2 그룹화 및 videoUrls 병합 (branded 전용)
  const processedContents = useMemo(() => {
    if (!work.contents) return [];

    const baseContent2Map = new Map<string, Content>();
    const attachContent2List: Content[] = [];

    work.contents.forEach((content) => {
      if (content.contentType === 2) {
        if (content.content2Role === 'base') {
          if (content._id) {
            baseContent2Map.set(content._id, { ...content });
          }
        } else if (content.content2Role === 'attach') {
          attachContent2List.push(content);
        } else {
          if (content._id) {
            baseContent2Map.set(content._id, { ...content });
          }
        }
      }
    });

    attachContent2List.forEach((attachContent) => {
      if (attachContent.attachToContentId) {
        const baseContent = baseContent2Map.get(attachContent.attachToContentId);
        if (baseContent) {
          const baseUrls = baseContent.videoUrls || [];
          const attachUrls = attachContent.videoUrls || [];
          baseContent.videoUrls = [...baseUrls, ...attachUrls];
        }
      }
    });

    const finalContents: Content[] = [];
    work.contents.forEach((content) => {
      if (content.contentType === 2 && content.content2Role === 'attach') {
        return;
      }
      if (content.contentType === 2 && content._id) {
        const mergedContent = baseContent2Map.get(content._id);
        if (mergedContent) {
          finalContents.push(mergedContent);
          return;
        }
      }
      finalContents.push(content);
    });

    return finalContents;
  }, [work.contents]);

  const scrollToContent = (contentIndex: number) => {
    const content = processedContents?.[contentIndex];
    if (content && contentRefs.current[contentIndex]) {
      contentRefs.current[contentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      setShowStickyNav(window.scrollY > 700);

      processedContents?.forEach((_, index) => {
        const element = contentRefs.current[index];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveContent(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [processedContents]);

  const renderContent = (content: Content, index: number) => {
    const commonProps = {
      category: content.category,
      subCategory: content.subCategory,
      date: content.date,
      title: content.title || "",
      description: content.description || "",
    };

    switch (content.contentType) {
      case 1:
        return (
          <Template1
            key={index}
            {...commonProps}
            videoUrl={content.videoUrl}
            videoUrls={undefined}
            images={content.images || []}
          />
        );
      case 2:
        return (
          <Template2
            key={index}
            {...commonProps}
            videoUrl={undefined}
            videoUrls={content.videoUrls}
          />
        );
      case 3:
        return (
          <Template3
            key={index}
            {...commonProps}
            images={content.images || []}
          />
        );
      case 4:
        return (
          <Template4
            key={index}
            {...commonProps}
            images={content.images || []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main
      className="w-full relative flex flex-col overflow-x-hidden pt-24"
      style={{ minHeight: "100vh" }}
    >

      <div className="flex-1 flex min-w-0">
        <div className="w-64 flex-shrink-0 pl-8 py-8 mr-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2 text-sm text-grey-400">
              <Link href="/" className="hover:text-grey-200 transition-colors">
                HOME
              </Link>
              <span className="text-grey-600">|</span>
              <span className="text-grey-200 font-medium">BRANDED</span>
            </div>

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

            {work.title && (
              <div className="text-white font-bold text-lg break-words">
                {work.title}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {work.client && (
                <div className="text-sm text-grey-500">
                  <span className="font-bold">Client</span> {work.client}
                </div>
              )}

              {work.category && (
                <div className="text-sm text-grey-500">
                  <span className="font-bold">Work</span>{" "}
                  {categoryLabels[work.category] || work.category}
                  {work.subCategory &&
                    ` > ${getSubCategoryLabel(work.category, work.subCategory)}`}
                </div>
              )}

              {work.publishedAt && (
                <div className="text-sm text-grey-500">
                  <span className="font-bold">Data</span>{" "}
                  {formatDate(work.publishedAt)}
                </div>
              )}
            </div>

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
          {processedContents && processedContents.length > 0 && (
            <div className="sticky top-[0%] flex flex-col gap-2 py-2.5">
              {processedContents.map((content, index) => (
                <button
                  key={index}
                  onClick={() => scrollToContent(index)}
                  className={`w-full text-center px-4 py-2 rounded-full text-xl font-medium transition-all ${
                    activeContent === index
                      ? "bg-brand text-white border-none"
                      : "border border-grey-700 text-grey-700 hover:text-white hover:border-white"
                  }`}
                >
                  Content {content.contentType}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 pr-8 py-8 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
          >
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

            {processedContents && processedContents.length > 0 && (
              <div className="space-y-24">
                {processedContents.map((content, index) => (
                  <div
                    key={content._id || index}
                    ref={(el) => {
                      contentRefs.current[index] = el;
                    }}
                  >
                    {renderContent(content, index)}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="w-full h-px bg-grey-700 mt-12 mb-12" />

      {relatedVideos && relatedVideos.length > 0 && (
        <div className="w-full">
          <RelationContentCard
            videos={relatedVideos.map((video) => ({
              ...video,
              onClick: () => {
                if (video.slug) router.push(`${BASE_PATH}/${video.slug}`);
              },
            }))}
            title="관련 영상을 더 찾으셨나요?"
          />
        </div>
      )}
    </main>
  );
}
