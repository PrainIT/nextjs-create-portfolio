"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import WorkCard from "@/components/WorkCard";
import SearchBar from "@/components/SearchBar";
import BottomPopup from "@/components/BottomPopup";

interface WorkProject {
  id: string;
  title: string;
  tags: string[];
  image?: string;
  category?: string;
  subCategory?: string;
  slug?: string;
  description?: string;
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

    // 브랜디드 페이지(/branded)에서 영상 콘텐츠인 경우 팝업 열기
    if (basePath === "/branded" && project.category === "video") {
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
          project.tags.some((tag) => tag.toLowerCase().includes(keyword)) ||
          project.description?.toLowerCase().includes(keyword)
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

          {/* 콘텐츠 영역 - 검색 모드일 때는 masonry, 아닐 때는 3열 그리드 */}
          {isSearching ? (
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
                    isSearchMode={isSearching}
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
                    isSearchMode={isSearching}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 하단 선 - 전체 너비, NavBar와 WorkCard 아래 */}
      <div className="w-full h-px bg-grey-700 mt-12 mb-12" />

      {/* 브랜디드 영상 팝업 */}
      <BottomPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        heightOption={{ wrapChildren: true }}
      >
        {selectedProject && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-black">
              {selectedProject.title}
            </h2>
            {selectedProject.description && (
              <p className="text-grey-600 mb-4">
                {selectedProject.description}
              </p>
            )}
            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedProject.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-grey-200 rounded text-sm text-black"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {selectedProject.image && (
              <div className="mt-6">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </BottomPopup>
    </main>
  );
}
