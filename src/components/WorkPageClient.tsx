"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import ContentCard from "@/components/ContentCard";
import SearchBar from "@/components/SearchBar";
import BottomPopup from "@/components/BottomPopup";
import RelationContentCard from "@/components/RelationContentCard";
import { getYouTubeEmbedUrl } from "@/components/work-utils/youtube";

interface WorkProject {
  id: string;
  title: string;
  tags: string[];
  image?: string;
  category?: string;
  subCategory?: string | string[]; // 단일 또는 배열
  slug?: string;
  description?: string;
  client?: string;
  publishedAt?: string;
  videoUrl?: string;
  videoUrls?: string[];
  contents?: any[]; // content 페이지용
  contentType?: number; // 콘텐츠 타입 (3, 4용)
  contentImages?: string[]; // 콘텐츠 이미지 URL 배열 (3, 4용)
  hasThumbnailImage?: boolean; // 썸네일 이미지 여부
  contentDate?: string; // content 페이지용 날짜
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
function ShortFormSlider({ 
  videoUrls, 
  title, 
  singleView = false 
}: { 
  videoUrls: string[]; 
  title: string; 
  singleView?: boolean;
}) {
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
    const scrollAmount = singleView 
      ? container.clientWidth 
      : container.clientWidth / 3; // 하나씩 보일 때는 전체 너비, 아니면 3개 중 1개씩
    container.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = singleView 
      ? container.clientWidth 
      : container.clientWidth / 3; // 하나씩 보일 때는 전체 너비, 아니면 3개 중 1개씩
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
              className={`flex-shrink-0 ${
                singleView 
                  ? "w-full min-w-full" 
                  : "w-[calc(33.333%-0.67rem)] min-w-[calc(33.333%-0.67rem)]"
              }`}
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
      {validUrls.length > (singleView ? 1 : 3) && (
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
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedCategory((prev) => {
      if (prev.includes(value)) {
        // 이미 선택된 것이면 제거
        return prev.filter((cat) => cat !== value);
      } else {
        // 선택되지 않은 것이면 추가
        return [...prev, value];
      }
    });
  };

  const handleSearch = (keyword: string) => {
    setIsSearching(keyword.length > 0);
  };

  const handleTitleClick = () => {
    setSelectedCategory([]);
    setSearchKeyword("");
    setIsSearching(false);
  };

  const handleProjectClick = useCallback((project: WorkProject) => {
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
  }, [basePath, router, onProjectClick]);

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
    setSelectedCategory([]);
  };

  // 필터링된 프로젝트
  const filteredProjects = useMemo(() => {
    let filtered = workProjects;

    // 카테고리 필터 (여러 개 선택 지원)
    if (selectedCategory.length > 0) {
      filtered = filtered.filter((project) => {
        // subCategory가 배열인 경우와 문자열인 경우 모두 처리
        if (Array.isArray(project.subCategory)) {
          // 배열 중 하나라도 selectedCategory에 포함되면 표시
          return project.subCategory.some((subCat) => selectedCategory.includes(subCat));
        }
        // 문자열인 경우 기존 로직 유지
        return selectedCategory.includes(project.subCategory || "");
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

  // 관련 영상 목록 계산 (같은 category와 subCategory의 다른 항목들)
  const relatedVideos = useMemo(() => {
    if (!selectedProject || !selectedProject.category) {
      return [];
    }

    // subCategory 비교 헬퍼 함수
    // 선택한 subCategory 중 하나라도 포함되어 있으면 true
    const hasMatchingSubCategory = (
      selectedSubCategory: string | string[] | undefined,
      projectSubCategory: string | string[] | undefined
    ): boolean => {
      // 둘 다 없으면 true (subCategory 필터링 없음)
      if (!selectedSubCategory && !projectSubCategory) {
        return true;
      }
      // 선택한 항목에 subCategory가 없으면 모든 항목 표시
      if (!selectedSubCategory) {
        return true;
      }
      // 프로젝트에 subCategory가 없으면 false
      if (!projectSubCategory) {
        return false;
      }

      // 둘 다 배열로 변환
      const selectedArray = Array.isArray(selectedSubCategory)
        ? selectedSubCategory
        : [selectedSubCategory];
      const projectArray = Array.isArray(projectSubCategory)
        ? projectSubCategory
        : [projectSubCategory];

      // 선택한 subCategory 중 하나라도 프로젝트에 포함되어 있으면 true
      return selectedArray.some((subCat) => projectArray.includes(subCat));
    };

    return workProjects
      .filter((project) => {
        // 같은 category이고, subCategory도 일치하고, 현재 선택된 항목이 아닌 것들
        return (
          project.category === selectedProject.category &&
          hasMatchingSubCategory(selectedProject.subCategory, project.subCategory) &&
          project.id !== selectedProject.id
        );
      })
      .map((project) => ({
        id: project.id,
        title: project.title,
        thumbnail: project.image,
        date: basePath === "/content" ? project.contentDate : project.publishedAt,
        slug: project.slug,
        onClick: () => {
          setIsPopupOpen(false);
          setSelectedProject(null);
          // 약간의 지연 후 클릭 처리 (팝업 닫기 애니메이션 완료 후)
          setTimeout(() => {
            handleProjectClick(project);
          }, 300);
        },
      }));
  }, [selectedProject, workProjects, basePath, handleProjectClick]);

  return (
    <main
      className="w-full relative flex flex-col overflow-x-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* 상단 선 */}
      <div className="w-full h-px bg-grey-700" />

      {/* NavBar와 ContentCard 영역 - flex row */}
      <div className="flex-1 flex min-w-0">
        {/* NavBar - 고정 너비 */}
        <div className="w-64 flex-shrink-0">
          <NavBar
            pageName={basePath === "/branded" ? "BRANDED" : "CONTENT"}
            title={pageTitle}
            categories={workCategories}
            showBackButton={true}
            selectedValue={selectedCategory as string[]}
            onSelect={handleSelect}
            onTitleClick={handleTitleClick}
          />
        </div>

        {/* ContentCard 영역 - 나머지 공간 */}
        <div className="flex-1 pr-8 py-8 min-w-0">
          {/* 검색창 */}
          <div className="flex items-center justify-end mb-8 w-full">
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
                  <ContentCard
                    id={index + 1}
                    title={project.title}
                    image={project.image}
                    videoUrl={project.videoUrl}
                    isSearchMode={isSearching}
                    forceSquare={basePath === "/branded"}
                    forceFullHeight={basePath === "/content"}
                    disableVideoInteraction={basePath === "/content"}
                    contentType={project.contentType}
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
                  <ContentCard
                    id={index + 1}
                    title={project.title}
                    image={project.image}
                    videoUrl={project.videoUrl}
                    isSearchMode={isSearching}
                    forceSquare={basePath === "/branded"}
                    forceFullHeight={basePath === "/content"}
                    disableVideoInteraction={basePath === "/content"}
                    contentType={project.contentType}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 하단 선 - 전체 너비, NavBar와 ContentCard 아래 */}
      <div className="w-full h-px bg-grey-700 mt-12 mb-12" />

      {/* 브랜디드/컨텐츠 팝업 */}
      <BottomPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        heightOption={{ 
          heightVh: 90 
        }}
      >
        {selectedProject && (
          <div className="px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-8">
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
              <div className="text-lg text-black mb-2">
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

            {/* Image Slider - 콘텐츠 3, 4용 (content 페이지용) */}
            {basePath === "/content" &&
              selectedProject.contentType &&
              (selectedProject.contentType === 3 || selectedProject.contentType === 4) &&
              selectedProject.contentImages &&
              selectedProject.contentImages.length > 0 && (
                <ImageSlider images={selectedProject.contentImages} title={selectedProject.title} />
              )}

            {/* Single Image - 콘텐츠 1, 2 또는 일반 이미지 (content 페이지용) */}
            {/* 썸네일 이미지가 아닌 경우만 표시 */}
            {basePath === "/content" &&
              selectedProject.image &&
              !selectedProject.videoUrl &&
              !selectedProject.hasThumbnailImage &&
              (!selectedProject.contentType || 
               (selectedProject.contentType !== 3 && selectedProject.contentType !== 4) ||
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

            {/* Video - description 아래 */}
            {/* content2이거나 숏폼인 경우 */}
            {selectedProject.contentType === 2 || 
             (Array.isArray(selectedProject.subCategory) 
               ? selectedProject.subCategory.includes("short-form")
               : selectedProject.subCategory === "short-form") ? (
              <>
                {/* content2 또는 숏폼 비디오 - BottomPopup에서는 첫 번째 하나만 표시 */}
                {(() => {
                  // videoUrls가 있으면 첫 번째만 사용, 없으면 videoUrl 사용
                  const firstVideoUrl = selectedProject.videoUrls && selectedProject.videoUrls.length > 0
                    ? selectedProject.videoUrls[0]
                    : selectedProject.videoUrl;
                  
                  if (!firstVideoUrl) return null;
                  
                  const embedUrl = getYouTubeEmbedUrl(firstVideoUrl);
                  if (!embedUrl) return null;
                  
                  return (
                    <div className="mb-6">
                      <div className="relative w-full max-w-sm mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-grey-800">
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
                })()}
              </>
            ) : (
              <>
                {/* 일반 비디오 - 단일 (Content 1용) */}
                {(() => {
                  // Content 1인 경우: videoUrl 우선, 없으면 videoUrls[0] 사용 (기존 데이터 호환성)
                  const videoUrlToUse = selectedProject.videoUrl 
                    || (selectedProject.videoUrls && selectedProject.videoUrls.length > 0 
                        ? selectedProject.videoUrls[0] 
                        : null);
                  
                  if (!videoUrlToUse) return null;
                  
                  const embedUrl = getYouTubeEmbedUrl(videoUrlToUse);
                  
                  // Content 1인 경우 항상 큰 사이즈로 표시 (videoUrls 무시)
                  if (embedUrl && selectedProject.contentType === 1) {
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
                  
                  // Content 1이 아니고 videoUrl이 있는 경우
                  if (embedUrl && !selectedProject.videoUrls?.length) {
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
                {/* 일반 비디오 - 여러 개 (Content 1이 아닌 경우만) */}
                {selectedProject.contentType !== 1 &&
                  selectedProject.videoUrls &&
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

            {/* 관련 영상 섹션 - tags 아래 */}
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
