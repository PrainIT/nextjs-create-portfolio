"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import WorkCard from "@/components/WorkCard";
import SearchBar from "@/components/SearchBar";

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
}

export default function WorkPageClient({
  workProjects,
  workCategories,
}: WorkPageClientProps) {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState("");

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
            pageName="WORK"
            title="전체 프로젝트"
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
                  onClick={() => {
                    if (project.slug) {
                      router.push(`/work/${project.slug}`);
                    }
                  }}
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
                  onClick={() => {
                    if (project.slug) {
                      router.push(`/work/${project.slug}`);
                    }
                  }}
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
    </main>
  );
}
