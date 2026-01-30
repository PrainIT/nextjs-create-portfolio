"use client";

import React from "react";
import Link from "next/link";

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

interface SearchAndFilterProps {
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
}

export default function SearchAndFilter({
  searchKeyword,
  onSearchChange,
}: SearchAndFilterProps) {
  return (
    <div className="w-full py-28 px-4">
      <div className="mx-auto py-4">
        {/* 검색바 */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative max-w-[560px] w-full">
            <input
              type="text"
              placeholder="ENTER A KEYWORD"
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-[100px] px-[14px] pr-[70px] rounded-full bg-[#000000] text-grey-200 text-3xl placeholder-grey-400 placeholder:text-3xl placeholder:text-white placeholder:opacity-10 text-center focus:outline-none focus:ring-2 focus:ring-brand"
              style={{
                textAlign: "center",
                lineHeight: "120px",
              }}
            />
            <button
              className="absolute right-[14px] top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white flex items-center justify-center hover:opacity-80 transition-opacity"
              type="button"
            >
              <svg
                className="size-7 shrink-0 text-brand"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 19L14.65 14.65"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <Link
            href="/content"
            className="inline-block px-8 py-3 rounded-full border border-white text-white font-medium hover:bg-black hover:text-brand hover:border-brand transition-colors"
          >
            전체보기
          </Link>
        </div>
      </div>
    </div>
  );
}
