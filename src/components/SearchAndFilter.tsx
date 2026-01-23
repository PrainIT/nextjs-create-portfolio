"use client";

import React from "react";

// Industry 서브카테고리 필터 (value와 label 매핑)
export const industrySubCategories = [
  { value: "finance", label: "금융" },
  { value: "corporate-pr-government", label: "기업PR/정부·공공기관" },
  { value: "it-communication-service", label: "IT·정보통신/서비스" },
  { value: "fashion-beauty-household", label: "패션·뷰티/생활용품" },
  { value: "appliance-electronics", label: "가전/전자" },
  { value: "food-beverage-pharmaceutical", label: "식음료/제약" },
  { value: "automotive-construction", label: "자동차/건설" },
  { value: "distribution-other", label: "유통/기타" },
];

// 기본 필터 (Industry 서브카테고리 기반)
export const defaultFilters = [
  { name: "전체", value: "all", count: 0 },
  ...industrySubCategories.map(cat => ({ name: cat.label, value: cat.value, count: 0 }))
];

// 호환성을 위해 filters도 export
export const filters = defaultFilters;

interface FilterWithCount {
  name: string;
  value: string;
  count: number;
}

interface SearchAndFilterProps {
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  selectedFilter: string;
  onFilterChange: (filterValue: string) => void;
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
    <div className="w-full py-8 px-4">
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
              <React.Fragment key={filter.value}>
                {isNewRow && <div className="w-full basis-full" />}
                <button
                  onClick={() => onFilterChange(filter.value)}
                  className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    selectedFilter === filter.value
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
