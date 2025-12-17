"use client";

import { useState, useMemo } from "react";
import SearchAndFilter, { filters } from "./SearchAndFilter";
import HorizontalScrollSection, {
  ContentCard,
} from "./HorizontalScrollSection";

interface ContentSectionProps {
  contentCards: ContentCard[];
}

export default function ContentSection({ contentCards }: ContentSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState(filters[0].name);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 필터별 카운트 계산
  const filtersWithCount = useMemo(() => {
    return filters.map((filter) => {
      if (filter.name === "전체") {
        return { ...filter, count: contentCards.length };
      }
      const count = contentCards.filter((card) =>
        card.filters?.includes(filter.name)
      ).length;
      return { ...filter, count };
    });
  }, [contentCards]);

  // 필터링된 카드
  const filteredCards = useMemo(() => {
    let filtered = contentCards;

    if (selectedFilter && selectedFilter !== "전체") {
      filtered = filtered.filter((card) =>
        card.filters?.includes(selectedFilter)
      );
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

      {/* 가로 스크롤 캐러셀 - sticky 섹션 */}
      <HorizontalScrollSection cards={filteredCards} />
    </>
  );
}
