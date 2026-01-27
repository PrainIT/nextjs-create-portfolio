"use client";

import { useState, useMemo } from "react";
import SearchAndFilter, { defaultFilters } from "./SearchAndFilter";

interface ContentCard {
  id: string;
  title: string;
  description: string;
  subDescription: string;
  image?: string;
  videoUrl?: string;
  contentType?: number;
  slug?: string;
  subCategory?: string | string[];
}

interface ContentSectionProps {
  contentCards: ContentCard[];
  subCategoryCounts?: Record<string, number>; // 서브카테고리별 카운트
}

export default function ContentSection({ contentCards, subCategoryCounts }: ContentSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 필터별 카운트 계산 (Industry 서브카테고리 기반)
  const filtersWithCount = useMemo(() => {
    return defaultFilters.map((filter) => {
      if (filter.value === "all") {
        return { ...filter, count: contentCards.length };
      }
      const count = subCategoryCounts?.[filter.value] || 0;
      return { ...filter, count };
    });
  }, [contentCards, subCategoryCounts]);

  // 필터링된 카드
  const filteredCards = useMemo(() => {
    let filtered = contentCards;

    if (selectedFilter && selectedFilter !== "all") {
      filtered = filtered.filter((card) => {
        // subCategory가 배열인 경우와 문자열인 경우 모두 처리
        if (Array.isArray(card.subCategory)) {
          return card.subCategory.includes(selectedFilter);
        }
        return card.subCategory === selectedFilter;
      });
    }

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.title.toLowerCase().includes(keyword) ||
          card.description.toLowerCase().includes(keyword) ||
          card.subDescription.toLowerCase().includes(keyword)
      );
    }

    return filtered;
  }, [contentCards, selectedFilter, searchKeyword]);

  return (
    <>
      {/* 검색창과 필터 - 일반 섹션 */}
      <SearchAndFilter
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        filtersWithCount={filtersWithCount}
      />
    </>
  );
}
