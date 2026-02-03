"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import ContentCard from "@/components/ContentCard";
import SearchBar from "@/components/SearchBar";
import BottomPopup from "@/app/content/BottomPopup";
import RelationContentCard from "@/components/RelationContentCard";
import { getYouTubeEmbedUrl } from "@/components/work-utils/youtube";

export interface ContentProject {
  id: string;
  title: string;
  tags: string[];
  image?: string;
  category?: string;
  subCategory?: string | string[];
  slug?: string;
  description?: string;
  client?: string;
  publishedAt?: string;
  videoUrl?: string;
  videoUrls?: string[];
  contentType?: number;
  contentImages?: string[];
  hasThumbnailImage?: boolean;
  contentDate?: string;
}

interface WorkCategory {
  readonly title: string;
  readonly items: readonly { readonly label: string; readonly value: string }[];
}

// 이미지 슬라이드 (콘텐츠 3, 4용)
function ImageSlider({ images, title }: { images: string[]; title: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth / images.length;
      container.scrollTo({
        left: container.scrollLeft - scrollWidth,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth / images.length;
      container.scrollTo({
        left: container.scrollLeft + scrollWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const updateIndex = () => {
      const scrollWidth = container.scrollWidth / images.length;
      const index = Math.round(container.scrollLeft / scrollWidth);
      setCurrentIndex(index);
    };
    container.addEventListener("scroll", updateIndex);
    return () => container.removeEventListener("scroll", updateIndex);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="mb-6 relative">
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="flex-shrink-0 w-full snap-center">
              <img
                src={imageUrl}
                alt={`${title} - 이미지 ${index + 1}`}
                className="w-full h-auto rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all ${
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="이전 이미지"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === images.length - 1}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all ${
              currentIndex === images.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            aria-label="다음 이미지"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="flex gap-2 justify-center mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const c = scrollContainerRef.current;
                    const w = c.scrollWidth / images.length;
                    c.scrollTo({ left: w * index, behavior: "smooth" });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index ? "bg-black w-6" : "bg-grey-300"
                }`}
                aria-label={`이미지 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface ContentPageClientProps {
  workProjects: ContentProject[];
  workCategories: readonly WorkCategory[];
  pageTitle?: string;
  initialSearchKeyword?: string;
}

export default function ContentPageClient({
  workProjects,
  workCategories,
  pageTitle = "전체 프로젝트",
  initialSearchKeyword: initialSearch = "",
}: ContentPageClientProps) {
  const [isSearching, setIsSearching] = useState(!!initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState(initialSearch);
  const [selectedProject, setSelectedProject] = useState<ContentProject | null>(
    null,
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedCategory((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  };

  const handleSearch = (keyword: string) => {
    setIsSearching(keyword.length > 0);
  };

  const handleTitleClick = () => {
    setSelectedCategory([]);
    setSearchKeyword("");
    setIsSearching(false);
  };

  const handleProjectClick = useCallback((project: ContentProject) => {
    setSelectedProject(project);
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProject(null);
  };

  const handleTagClick = (tag: string) => {
    if (isPopupOpen) {
      setIsPopupOpen(false);
      setSelectedProject(null);
    }
    setSearchKeyword(tag);
    setIsSearching(true);
    setSelectedCategory([]);
  };

  const filteredProjects = useMemo(() => {
    let filtered = workProjects;
    if (selectedCategory.length > 0) {
      filtered = filtered.filter((project) => {
        if (Array.isArray(project.subCategory)) {
          return project.subCategory.some((subCat) =>
            selectedCategory.includes(subCat),
          );
        }
        return selectedCategory.includes(project.subCategory || "");
      });
    }
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          (project.title?.toLowerCase() || "").includes(keyword) ||
          (project.tags || []).some((tag) =>
            (tag?.toLowerCase() || "").includes(keyword),
          ),
      );
    }
    return filtered;
  }, [workProjects, selectedCategory, searchKeyword]);

  const relatedVideos = useMemo(() => {
    if (!selectedProject || !selectedProject.category) return [];
    const hasMatchingSubCategory = (
      sel: string | string[] | undefined,
      proj: string | string[] | undefined,
    ): boolean => {
      if (!sel && !proj) return true;
      if (!sel) return true;
      if (!proj) return false;
      const sa = Array.isArray(sel) ? sel : [sel];
      const pa = Array.isArray(proj) ? proj : [proj];
      return sa.some((s) => pa.includes(s));
    };
    return workProjects
      .filter(
        (p) =>
          p.category === selectedProject.category &&
          hasMatchingSubCategory(selectedProject.subCategory, p.subCategory) &&
          p.id !== selectedProject.id,
      )
      .map((p) => ({
        id: p.id,
        title: p.title,
        thumbnail: p.image,
        date: p.contentDate,
        slug: p.slug,
        onClick: () => {
          setIsPopupOpen(false);
          setSelectedProject(null);
          setTimeout(() => handleProjectClick(p), 300);
        },
      }));
  }, [selectedProject, workProjects, handleProjectClick]);

  return (
    <main
      className="w-full relative flex flex-col overflow-x-hidden pt-24"
      style={{ minHeight: "100vh" }}
    >
      <div className="flex-1 flex min-w-0">
        <div className="w-64 flex-shrink-0">
          <NavBar
            pageName="CONTENT"
            title={pageTitle}
            categories={workCategories}
            showBackButton={true}
            selectedValue={selectedCategory as string[]}
            onSelect={handleSelect}
            onTitleClick={handleTitleClick}
          />
        </div>

        <div className="flex-1 pr-8 py-8 min-w-0">
          <div className="flex items-center justify-end mb-8 w-full">
            <div className="w-full max-w-[850px]">
              <SearchBar
                placeholder="SEARCH"
                onSearch={handleSearch}
                value={searchKeyword}
                onChange={(v) => {
                  setSearchKeyword(v);
                  handleSearch(v);
                }}
              />
            </div>
          </div>

          <div className="columns-3 gap-6" style={{ columnGap: "1rem" }}>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.08 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onClick={() => handleProjectClick(project)}
                className="cursor-pointer hover:opacity-90 transition-opacity mb-6 break-inside-avoid"
              >
                <ContentCard
                  id={index + 1}
                  title={project.title}
                  image={project.image}
                  videoUrl={project.videoUrl}
                  isSearchMode={isSearching}
                  forceSquare={false}
                  forceFullHeight={true}
                  disableVideoInteraction={true}
                  contentType={project.contentType}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 선 - 부모 padding으로 좌우 inset */}
      <div className="px-2 md:px-12 my-12">
        <div className="w-full h-px bg-gray-700 opacity-40" />
      </div>

      <BottomPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        heightOption={{ heightVh: 90 }}
      >
        {selectedProject && (
          <div className="px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-8">
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-grey-500 hover:text-black transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {selectedProject.client && (
              <div className="text-lg text-black mb-2 px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48">
                {selectedProject.client}
              </div>
            )}

            <div className="flex items-end gap-4 mb-4 px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48">
              <h2 className="text-2xl font-bold text-black">
                {selectedProject.title}
              </h2>
              {selectedProject.publishedAt && (
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(selectedProject.publishedAt)
                    .toISOString()
                    .split("T")[0]
                    .replace(/-/g, "-")}
                </div>
              )}
            </div>

            {selectedProject.description && (
              <p className="text-base text-black mb-6 px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48">
                {selectedProject.description}
              </p>
            )}

            {selectedProject.contentType &&
              (selectedProject.contentType === 3 ||
                selectedProject.contentType === 4) &&
              selectedProject.contentImages &&
              selectedProject.contentImages.length > 0 && (
                <div className="px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48">
                  <ImageSlider
                    images={selectedProject.contentImages}
                    title={selectedProject.title}
                  />
                </div>
              )}

            {selectedProject.image &&
              !selectedProject.videoUrl &&
              !selectedProject.hasThumbnailImage &&
              (!selectedProject.contentType ||
                (selectedProject.contentType !== 3 &&
                  selectedProject.contentType !== 4) ||
                !selectedProject.contentImages ||
                selectedProject.contentImages.length === 0) && (
                <div className="mb-6">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}

            {/* Video */}
            {selectedProject.contentType === 2 ||
            (Array.isArray(selectedProject.subCategory)
              ? selectedProject.subCategory.includes("short-form")
              : selectedProject.subCategory === "short-form") ? (
              (() => {
                const first = selectedProject.videoUrls?.length
                  ? selectedProject.videoUrls[0]
                  : selectedProject.videoUrl;
                if (!first) return null;
                const embed = getYouTubeEmbedUrl(first);
                if (!embed) return null;
                return (
                  <div className="mb-6">
                    <div className="relative w-full max-w-sm mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-grey-800">
                      <iframe
                        src={embed}
                        title={selectedProject.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                );
              })()
            ) : (
              <>
                {(() => {
                  const url =
                    selectedProject.videoUrl ||
                    (selectedProject.videoUrls?.length
                      ? selectedProject.videoUrls[0]
                      : null);
                  if (!url) return null;
                  const embed = getYouTubeEmbedUrl(url);
                  if (!embed) return null;
                  if (selectedProject.contentType === 1) {
                    return (
                      <div className="mb-6 px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                          <iframe
                            src={embed}
                            title={selectedProject.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    );
                  }
                  if (!selectedProject.videoUrls?.length) {
                    return (
                      <div className="mb-6">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                          <iframe
                            src={embed}
                            title={selectedProject.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                {selectedProject.contentType !== 1 &&
                  selectedProject.videoUrls &&
                  selectedProject.videoUrls.length > 0 && (
                    <div className="mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedProject.videoUrls
                          .filter((u) => u && getYouTubeEmbedUrl(u))
                          .map((url, i) => {
                            const embed = getYouTubeEmbedUrl(url);
                            if (!embed) return null;
                            return (
                              <div
                                key={i}
                                className="relative w-full aspect-video rounded-lg overflow-hidden"
                              >
                                <iframe
                                  src={embed}
                                  title={`${selectedProject.title} - Video ${i + 1}`}
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
              </>
            )}

            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div className="mb-4 px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48">
                <div className="h-px bg-grey-300 mt-4 mb-4" />
                <div className="flex items-center gap-2 text-sm font-bold text-black mb-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2.5 6.5L6.5 2.5H13.5V9.5L9.5 13.5L2.5 6.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="10" cy="6" r="1" fill="currentColor" />
                  </svg>
                  TAG
                </div>
                <div className="flex gap-2 flex-wrap">
                  {selectedProject.tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTagClick(tag)}
                      className="px-4 py-1 border border-black rounded-full text-sm text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      # {tag}
                    </button>
                  ))}
                </div>
                <div className="h-px bg-grey-300 mt-4 mb-4" />
              </div>
            )}

            {relatedVideos.length > 0 && (
              <div className="mt-6 -mx-6 sm:-mx-12 md:-mx-16 lg:-mx-20 xl:-mx-24 -mb-8">
                <RelationContentCard
                  videos={relatedVideos}
                  title="관련 영상을 더 찾으셨나요?"
                />
              </div>
            )}
          </div>
        )}
      </BottomPopup>
    </main>
  );
}
