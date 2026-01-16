"use client";

import { useState, useMemo } from "react";
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
}

interface WorkCategory {
  readonly title: string;
  readonly items: readonly { readonly label: string; readonly value: string }[];
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
          project.title.toLowerCase().includes(keyword) ||
          project.tags.some((tag) => tag.toLowerCase().includes(keyword))
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

            {/* Image - description 아래 (content 페이지용) */}
            {basePath === "/content" && selectedProject.image && !selectedProject.videoUrl && (
              <div className="mb-6">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* Video - description 아래 */}
            {selectedProject.videoUrl && (
              <div className="mb-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedProject.videoUrl)}
                    title={selectedProject.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

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
