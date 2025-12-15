"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import React from "react";
import { motion } from "framer-motion";

const filters = [
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

interface ContentCard {
  id: string;
  title: string;
  description: string;
  subDescription: string;
  number?: string;
  brand?: string;
  image?: string;
  slug?: string;
  filters?: string[];
}

interface ContentSectionProps {
  contentCards: ContentCard[];
}

export default function ContentSection({ contentCards }: ContentSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState(filters[0].name);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sectionHeight, setSectionHeight] = useState("300vh");
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

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
          card.subDescription.toLowerCase().includes(keyword) ||
          card.brand?.toLowerCase().includes(keyword)
      );
    }

    return filtered;
  }, [contentCards, selectedFilter, searchKeyword]);

  // 필터링된 카드 개수에 따라 섹션 높이 동적 계산
  useEffect(() => {
    if (!carouselRef.current) return;

    // 카드 개수에 따라 높이 계산
    const cardCount = filteredCards.length;

    // 최소 높이 보장 (카드가 적어도 충분한 스크롤 공간)
    const minHeight = 200; // 200vh
    // 카드당 추가 높이 (카드 1개당 50vh 정도)
    const heightPerCard = 50;
    // 계산된 높이
    const calculatedHeight = Math.max(minHeight, cardCount * heightPerCard);

    setSectionHeight(`${calculatedHeight}vh`);
  }, [filteredCards]);

  // 가로 스크롤 효과
  useEffect(() => {
    if (!sectionRef.current || !carouselRef.current) return;

    const section = sectionRef.current;
    const carousel = carouselRef.current;

    const handleScroll = () => {
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const viewportHeight = window.innerHeight;

      // 섹션의 시작점 (sticky 시작점)
      const sectionStart = window.scrollY + sectionTop;

      // 캐러셀의 최대 가로 스크롤 거리
      const maxScrollWidth = carousel.scrollWidth - carousel.clientWidth;

      // 섹션 높이에서 한 화면 높이를 뺀 값이 실제 스크롤 가능한 범위
      const scrollableHeight = section.offsetHeight - viewportHeight;

      // 현재 스크롤 위치가 섹션 내에서 얼마나 진행되었는지 계산
      const scrollProgress = Math.max(
        0,
        Math.min(1, (window.scrollY - sectionStart) / scrollableHeight)
      );

      // 가로 스크롤 적용
      const transformX = -scrollProgress * maxScrollWidth;
      carousel.style.transform = `translateX(${transformX}px)`;
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [filteredCards]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#1A1A1A] relative"
      style={{ height: sectionHeight }}
    >
      <div
        ref={stickyRef}
        className="sticky top-[-140px] h-screen flex items-center mb-12"
      >
        <div className="w-full py-16 px-4">
          <div className="max-w-[1440px] mx-auto">
            {/* 검색바 */}
            <div className="flex justify-center mb-8">
              <div className="relative max-w-[850px] w-full">
                <input
                  type="text"
                  placeholder="ENTER A KEYWORD"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
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
                      onClick={() => setSelectedFilter(filter.name)}
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

            {/* 캐러셀 리스트 */}
            <div className="relative overflow-hidden">
              <div
                ref={carouselRef}
                className="flex gap-6"
                style={{
                  willChange: "transform",
                  transition: "transform 0.1s ease-out",
                }}
              >
                {filteredCards.length > 0 ? (
                  filteredCards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="min-w-[407px] flex-shrink-0"
                    >
                      <div className="bg-grey-800 rounded-2xl overflow-hidden h-[878px] relative">
                        {/* 카드 이미지 영역 */}
                        {card.image ? (
                          <img
                            src={card.image}
                            alt={card.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                            <span className="text-grey-500 text-sm">
                              이미지 영역
                            </span>
                          </div>
                        )}

                        {/* 카드 텍스트 영역 - 이미지 위에 오버레이 */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                          {card.number && (
                            <div className="text-4xl font-bold text-white mb-4 text-center">
                              {card.number} →
                            </div>
                          )}
                          {card.brand && (
                            <div className="text-2xl font-bold text-white mb-4 text-center">
                              {card.brand}
                            </div>
                          )}
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {card.title}
                          </h3>
                          <p className="text-grey-300 mb-1">
                            {card.description}
                          </p>
                          <p className="text-grey-400 text-sm">
                            {card.subDescription}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="w-full text-center py-16">
                    <p className="text-grey-400 text-lg">
                      {searchKeyword
                        ? "검색 결과가 없습니다."
                        : "표시할 콘텐츠가 없습니다."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
