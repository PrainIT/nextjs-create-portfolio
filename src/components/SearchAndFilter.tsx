"use client";

import React from "react";

export const filters = [
  { name: "전체", count: 0 },
  { name: "릴스 Reels", count: 0 },
  { name: "숏품 Short-form", count: 0 },
  { name: "숏츠 Shorts", count: 0 },
  { name: "브이로그 Vlog", count: 0 },
  { name: "브랜디드 영상 Branded Film", count: 0 },
  { name: "예능 Entertainment", count: 0 },
  { name: "스케치 영상 Sketch Film", count: 0 },
  { name: "드라마 Drama", count: 0 },
  { name: "인터뷰 Interview", count: 0 },
  { name: "바이럴영상 Viral", count: 0 },
];

interface FilterWithCount {
  name: string;
  count: number;
}

interface SearchAndFilterProps {
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  filtersWithCount: FilterWithCount[];
}

export default function SearchAndFilter({
  searchKeyword,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  filtersWithCount,
}: SearchAndFilterProps) {
  return (
    <div className="w-full py-8 px-4 bg-[#1A1A1A]">
      <div className="max-w-[1440px] mx-auto">
        {/* 검색바 */}
        <div className="flex justify-center mb-6 pt-100">
          <div className="relative max-w-[850px] w-full">
            <input
              type="text"
              placeholder="ENTER A KEYWORD"
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-[120px] px-[14px] pr-[70px] rounded-full bg-[#0f0f0f] text-grey-200 text-3xl placeholder-grey-400 placeholder:text-3xl placeholder:text-white placeholder:opacity-10 text-center focus:outline-none focus:ring-2 focus:ring-brand"
              style={{
                textAlign: "center",
                lineHeight: "120px",
              }}
            />
            <button
              className="absolute right-[14px] top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#FF6B35] flex items-center justify-center hover:opacity-80 transition-opacity"
              type="button"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 19L14.65 14.65"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 필터 태그들 */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {filtersWithCount.map((filter, index) => {
            const isNewRow = index > 0 && index % 5 === 0;
            return (
              <React.Fragment key={filter.name}>
                {isNewRow && <div className="w-full basis-full" />}
                <button
                  onClick={() => onFilterChange(filter.name)}
                  className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    selectedFilter === filter.name
                      ? "border-[#FF6B35] text-[#FF6B35]"
                      : "border-grey-600 text-grey-600 hover:border-grey-100 hover:text-grey-100"
                  }`}
                >
                  {filter.name} {filter.count > 0 && `(${filter.count})`}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
