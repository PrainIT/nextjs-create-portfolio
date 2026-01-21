"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import WorkCard from "@/components/WorkCard";
import SearchBar from "@/components/SearchBar";
import BottomPopup from "@/components/BottomPopup";
import { getYouTubeEmbedUrl } from "@/components/work-utils/youtube";

interface WorkProject {
  id: string;
  title: string;
  tags: string[];
  image?: string;
  category?: string;
  subCategory?: string;
  slug?: string;
  description?: string;
  client?: string;
  publishedAt?: string;
  videoUrl?: string;
  videoUrls?: string[];
  templates?: any[]; // content 페이지용
  templateType?: number; // 템플릿 타입 (3, 4용)
  templateImages?: string[]; // 템플릿 이미지 URL 배열 (3, 4용)
}

interface WorkCategory {
  readonly title: string;
  readonly items: readonly { readonly label: string; readonly value: string }[];
}

// 이미지 슬라이드 컴포넌트 (템플릿 3, 4용)
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
            <div
              key={index}
              className="flex-shrink-0 w-full snap-center"
            >
              <img
                src={imageUrl}
                alt={`${title} - 이미지 ${index + 1}`}
                className="w-full h-auto rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 네비게이션 버튼 */}
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
              currentIndex === images.length - 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="다음 이미지"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 인디케이터 */}
          <div className="flex gap-2 justify-center mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const container = scrollContainerRef.current;
                    const scrollWidth = container.scrollWidth / images.length;
                    container.scrollTo({
                      left: scrollWidth * index,
                      behavior: "smooth",
                    });
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

// 숏폼 비디오 슬라이드 컴포넌트 (Template2 스타일)
function ShortFormSlider({ videoUrls, title }: { videoUrls: string[]; title: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 유튜브는 단일, 숏폼은 배열로 처리
  const allVideoUrls =
    videoUrls && videoUrls.length > 0
      ? videoUrls.filter((url) => url && url.trim()) // 빈 URL 필터링
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

  if (validUrls.length === 0) return null;

  return (
    <div className="mb-6 relative">
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
  );
}

interface WorkPageClientProps {
  workProjects: WorkProject[];
  workCategories: readonly WorkCategory[];
  basePath: string; // "/branded" 또는 "/content"
  pageTitle?: string; // 페이지 제목 (기본값: "전체 프로젝트")
  onProjectClick?: (project: WorkProject) => void; // 커스텀 클릭 핸들러
}

export default function WorkPageClient({
  workProjects,
  workCategories,
  basePath,
  pageTitle = "전체 프로젝트",
  onProjectClick,
}: WorkPageClientProps) {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSearch = (keyword: string) => {
    setIsSearching(keyword.length > 0);
  };

  const handleTitleClick = () => {
    setSelectedCategory("");
    setSearchKeyword("");
    setIsSearching(false);
  };

  const handleProjectClick = (project: WorkProject) => {
    // 커스텀 핸들러가 있으면 사용
    if (onProjectClick) {
      onProjectClick(project);
      return;
    }

    // branded 페이지에서는 모든 클릭을 slug routing으로 처리
    if (basePath === "/branded") {
      if (project.slug) {
        router.push(`${basePath}/${project.slug}`);
      }
    } else if (basePath === "/content") {
      // content 페이지에서는 BottomPopup 표시
      setSelectedProject(project);
      setIsPopupOpen(true);
    } else {
      // 그 외의 경우 라우팅
      if (project.slug) {
        router.push(`${basePath}/${project.slug}`);
      }
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProject(null);
  };

  const handleTagClick = (tag: string) => {
    // 팝업이 열려있으면 닫기
    if (isPopupOpen) {
      setIsPopupOpen(false);
      setSelectedProject(null);
    }
    // 태그를 검색어로 설정
    setSearchKeyword(tag);
    setIsSearching(true);
    // 카테고리 필터 초기화
    setSelectedCategory("");
  };

  // 필터링된 프로젝트
  const filteredProjects = useMemo(() => {
    let filtered = workProjects;

    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter((project) => {
        // selectedCategory가 서브 카테고리 값이면 정확히 일치하는 것만 필터링
        // 예: "branded-video"를 선택하면 subCategory가 "branded-video"인 것만 표시
        return project.subCategory === selectedCategory;
      });
    }

    // 검색 필터
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          (project.title?.toLowerCase() || "").includes(keyword) ||
          (project.tags || []).some((tag) => 
            (tag?.toLowerCase() || "").includes(keyword)
          )
      );
    }

    return filtered;
  }, [workProjects, selectedCategory, searchKeyword]);

  return (
    <main
      className="w-full relative flex flex-col"
      style={{ minHeight: "100vh" }}
    >
      {/* 상단 선 */}
      <div className="w-full h-px bg-grey-700" />

      {/* NavBar와 WorkCard 영역 - flex row */}
      <div className="flex-1 flex">
        {/* NavBar - 고정 너비 */}
        <div className="w-64 flex-shrink-0">
          <NavBar
            pageName={basePath === "/branded" ? "BRANDED" : "CONTENT"}
            title={pageTitle}
            categories={workCategories}
            showBackButton={true}
            selectedValue={selectedCategory}
            onSelect={handleSelect}
            onTitleClick={handleTitleClick}
          />
        </div>

        {/* WorkCard 영역 - 나머지 공간 */}
        <div className="flex-1 pr-8 py-8">
          {/* 검색창 */}
          <div className="flex items-center justify-end mb-8">
            <div className="w-full max-w-[850px]">
              <SearchBar
                placeholder="SEARCH"
                onSearch={handleSearch}
                value={searchKeyword}
                onChange={(value) => {
                  setSearchKeyword(value);
                  handleSearch(value);
                }}
              />
            </div>
          </div>

          {/* 콘텐츠 영역 - content는 항상 masonry, branded는 검색 모드일 때만 masonry */}
          {basePath === "/content" || isSearching ? (
            <div className="columns-3 gap-6" style={{ columnGap: "1.5rem" }}>
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="cursor-pointer hover:opacity-90 transition-opacity mb-6 break-inside-avoid"
                >
                  <WorkCard
                    id={index + 1}
                    title={project.title}
                    tags={project.tags}
                    image={project.image}
                    videoUrl={project.videoUrl}
                    isSearchMode={isSearching}
                    forceSquare={basePath === "/branded"}
                    forceFullHeight={basePath === "/content"}
                    disableVideoInteraction={basePath === "/content"}
                    onTagClick={handleTagClick}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <WorkCard
                    id={index + 1}
                    title={project.title}
                    tags={project.tags}
                    image={project.image}
                    videoUrl={project.videoUrl}
                    isSearchMode={isSearching}
                    forceSquare={basePath === "/branded"}
                    forceFullHeight={basePath === "/content"}
                    disableVideoInteraction={basePath === "/content"}
                    onTagClick={handleTagClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 하단 선 - 전체 너비, NavBar와 WorkCard 아래 */}
      <div className="w-full h-px bg-grey-700 mt-12 mb-12" />

      {/* 브랜디드/컨텐츠 팝업 */}
      <BottomPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        heightOption={{ wrapChildren: true }}
      >
        {selectedProject && (
          <div className="p-8">
            {/* 닫기 버튼 */}
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-grey-500 hover:text-black transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Client 이름 - title 상단 */}
            {selectedProject.client && (
              <div className="text-sm text-black mb-2">
                {selectedProject.client}
              </div>
            )}

            {/* Title과 PublishedAt - 같은 줄 */}
            <div className="flex items-end gap-4 mb-4">
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

            {/* Description - title 아래 */}
            {selectedProject.description && (
              <p className="text-base text-black mb-6">
                {selectedProject.description}
              </p>
            )}

            {/* Image Slider - 템플릿 3, 4용 (content 페이지용) */}
            {basePath === "/content" &&
              selectedProject.templateType &&
              (selectedProject.templateType === 3 || selectedProject.templateType === 4) &&
              selectedProject.templateImages &&
              selectedProject.templateImages.length > 0 && (
                <ImageSlider images={selectedProject.templateImages} title={selectedProject.title} />
              )}

            {/* Single Image - 템플릿 1, 2 또는 일반 이미지 (content 페이지용) */}
            {basePath === "/content" &&
              selectedProject.image &&
              !selectedProject.videoUrl &&
              (!selectedProject.templateType || 
               (selectedProject.templateType !== 3 && selectedProject.templateType !== 4) ||
               !selectedProject.templateImages ||
               selectedProject.templateImages.length === 0) && (
                <div className="mb-6">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}

            {/* Video - description 아래 */}
            {/* 숏폼인 경우 */}
            {selectedProject.subCategory === "short-form" ? (
              <>
                {/* 숏폼 비디오 - videoUrls 우선, 없으면 videoUrl 사용 */}
                {(() => {
                  // videoUrls가 있으면 사용, 없으면 videoUrl을 배열로 변환
                  const videoUrls = selectedProject.videoUrls && selectedProject.videoUrls.length > 0
                    ? selectedProject.videoUrls
                    : selectedProject.videoUrl
                      ? [selectedProject.videoUrl]
                      : [];
                  
                  if (videoUrls.length === 0) return null;
                  
                  // Template2 스타일로 항상 표시
                  return <ShortFormSlider videoUrls={videoUrls} title={selectedProject.title} />;
                })()}
              </>
            ) : (
              <>
                {/* 일반 비디오 - 단일 */}
                {(() => {
                  if (!selectedProject.videoUrl) return null;
                  
                  const embedUrl = getYouTubeEmbedUrl(selectedProject.videoUrl);
                  const hasVideoUrls = selectedProject.videoUrls && selectedProject.videoUrls.length > 0;
                  
                  // videoUrl이 있고 videoUrls가 없거나 비어있을 때 단일 비디오 표시
                  if (embedUrl && !hasVideoUrls) {
                    return (
                      <div className="mb-6">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                          <iframe
                            src={embedUrl}
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
                {/* 일반 비디오 - 여러 개 */}
                {selectedProject.videoUrls &&
                  selectedProject.videoUrls.length > 0 && (
                    <div className="mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedProject.videoUrls
                          .filter((url) => url && getYouTubeEmbedUrl(url))
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
                                  title={`${selectedProject.title} - Video ${index + 1}`}
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

            {/* Tags - video 아래, 위아래 divider */}
            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <>
                <div className="h-px bg-grey-300 mb-4" />
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-black mb-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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
                </div>
                <div className="h-px bg-grey-300 mb-4" />
              </>
            )}

            {/* 관련 영상 섹션 - tags 아래 (branded 페이지용) */}
            {basePath === "/branded" && (
              <div className="mt-6">
                <div className="bg-brand text-white px-6 py-3 rounded-lg mb-4">
                  <h3 className="text-lg font-bold">
                    관련 영상을 더 찾으셨나요?
                  </h3>
                </div>
                {/* 관련 영상 리스트는 추후 구현 */}
                <div className="text-sm text-grey-500">
                  관련 영상 목록이 여기에 표시됩니다.
                </div>
              </div>
            )}
          </div>
        )}
      </BottomPopup>
    </main>
  );
}
