"use client";

import { useState, useMemo } from "react";
import SearchAndFilter from "./SearchAndFilter";

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
  const [searchKeyword, setSearchKeyword] = useState("");

  // 필터링된 카드 (검색어만 적용)
  const filteredCards = useMemo(() => {
    let filtered = contentCards;

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
  }, [contentCards, searchKeyword]);

  return (
    <>
      {/* 검색창 - 일반 섹션 */}
      <SearchAndFilter
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
      />
    </>
  );
}
