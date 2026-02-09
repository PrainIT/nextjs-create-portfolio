"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/**
 * 섹션 스크롤 네비게이션 훅
 *
 * 여러 섹션이 있을 때 "Content 1", "Content 2" 같은 버튼을 누르면 해당 섹션으로 스크롤하고,
 * 스크롤 위치에 따라 현재 보이는 섹션 인덱스를 추적합니다.
 *
 * @param sectionCount - 섹션 개수
 * @returns sectionRefs (각 섹션에 ref 콜백으로 전달), activeIndex, scrollToIndex
 *
 * @example
 * const { sectionRefs, activeIndex, scrollToIndex } = useScrollSectionNav(items.length);
 *
 * return (
 *   <>
 *     <ScrollSectionNav
 *       items={items.map((c) => ({ label: `Content ${c.contentType}` }))}
 *       activeIndex={activeIndex}
 *       onSelect={scrollToIndex}
 *     />
 *     {items.map((item, i) => (
 *       <div key={i} ref={sectionRefs(i)}>...</div>
 *     ))}
 *   </>
 * );
 */
export function useScrollSectionNav(sectionCount: number) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const sectionRefs = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      refs.current[index] = el;
    },
    []
  ) as (index: number) => (el: HTMLDivElement | null) => void;

  const scrollToIndex = useCallback((index: number) => {
    const el = refs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    if (sectionCount <= 0) return;
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      for (let i = 0; i < sectionCount; i++) {
        const el = refs.current[i];
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveIndex(i);
            return;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionCount]);

  return { sectionRefs, activeIndex, scrollToIndex };
}

export interface ScrollSectionNavItem {
  label: string;
}

interface ScrollSectionNavProps {
  /** 버튼에 표시할 라벨 목록 (순서대로 Content 1, Content 2에 대응) */
  items: ScrollSectionNavItem[];
  /** 현재 스크롤로 활성화된 인덱스 */
  activeIndex: number | null;
  /** 버튼 클릭 시 호출 (인덱스 전달) */
  onSelect: (index: number) => void;
  /** 레이아웃: 가로 배치(default) / 세로 배치 */
  layout?: "horizontal" | "vertical";
  /** 추가 className (버튼 래퍼) */
  className?: string;
  /** 활성/비활성 버튼 스타일 - 기본은 brand 배경 + 테두리 */
  activeClassName?: string;
  inactiveClassName?: string;
}

/**
 * 스크롤 섹션 네비게이션 버튼 UI
 *
 * useScrollSectionNav와 함께 사용합니다.
 * 레이아웃: 가로(flex-wrap gap) 또는 세로(sticky 등) 배치 가능.
 */
export default function ScrollSectionNav({
  items,
  activeIndex,
  onSelect,
  layout = "horizontal",
  className = "",
  activeClassName = "bg-brand text-white border-none",
  inactiveClassName = "border border-grey-700 text-grey-700 hover:text-white hover:border-white",
}: ScrollSectionNavProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={
        layout === "vertical"
          ? `flex flex-col gap-2 py-2.5 ${className}`
          : `flex flex-wrap gap-2 ${className}`
      }
    >
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className={`text-center px-4 py-2 rounded-full text-base font-medium transition-all ${
            layout === "vertical" ? "w-full text-xl" : ""
          } ${activeIndex === index ? activeClassName : inactiveClassName}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
