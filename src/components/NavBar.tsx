"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CategoryItem {
  readonly label: string;
  readonly value: string;
}

interface Category {
  readonly title: string;
  /** 서브카테고리 없을 때 필터용(예: ai, linkedin) */
  readonly value?: string;
  readonly items: readonly CategoryItem[];
}

interface NavBarProps {
  pageName: string;
  title: string;
  categories: readonly Category[];
  showBackButton?: boolean;
  backButtonHref?: string;
  selectedValue?: string[];
  onSelect?: (value: string) => void;
  onTitleClick?: () => void;
  /** 카테고리 제목(예: 영상 콘텐츠) 클릭 시 해당 카테고리 전체의 value 배열로 호출 */
  onCategoryTitleClick?: (itemValues: string[]) => void;
  absolute?: boolean;
}

export default function NavBar({
  pageName,
  title,
  categories,
  showBackButton = false,
  backButtonHref,
  selectedValue,
  onSelect,
  onTitleClick,
  onCategoryTitleClick,
  absolute = false,
}: NavBarProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(selectedValue || []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // selectedValue prop이 변경되면 내부 state도 업데이트
  useEffect(() => {
    setSelected(selectedValue || []);
  }, [selectedValue]);

  // Esc 키로 메뉴 닫기
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const handleBack = () => {
    if (backButtonHref) {
      router.push(backButtonHref);
    } else {
      router.back();
    }
  };

  const handleSelect = (value: string) => {
    setSelected((prev) => {
      if (prev.includes(value)) {
        return prev.filter((cat) => cat !== value);
      } else {
        return [...prev, value];
      }
    });
    onSelect?.(value);
  };

  const navContent = (
    <div className="flex flex-col gap-6">
      {/* HOME | PageName */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          HOME
        </Link>
        <span className="text-gray-400">|</span>
        <span className="text-gray-800 font-medium">{pageName}</span>
      </div>

      {/* 뒤로가기 버튼 */}
      {showBackButton && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1 }}
          whileHover={{ x: -5 }}
          whileTap={{ x: -2 }}
          onClick={handleBack}
          className="flex items-center gap-2 text-xs text-gray-700 hover:text-gray-900 cursor-pointer transition-colors"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}

      {/* 제목 */}
      {onTitleClick ? (
        <button
          onClick={onTitleClick}
          className="text-gray-900 font-bold text-base text-left hover:text-brand transition-colors cursor-pointer"
        >
          {title}
        </button>
      ) : (
        <h2 className="text-gray-900 font-bold text-base">{title}</h2>
      )}

      {/* 카테고리별 메뉴 */}
      <div className="flex flex-col gap-6 mt-3">
        {categories.map((category, categoryIndex) => (
          <div key={category.title} className="flex flex-col gap-3">
            {onCategoryTitleClick ? (
              <motion.button
                type="button"
                onClick={() => {
                  const itemValues =
                    category.items.length > 0
                      ? category.items.map((item) => item.value)
                      : category.value
                        ? [category.value]
                        : [];
                  onCategoryTitleClick(itemValues);
                }}
                className={`text-left font-bold text-xs hover:text-brand transition-colors cursor-pointer ${
                  category.items.length === 0 &&
                  category.value &&
                  selected.includes(category.value)
                    ? "text-brand"
                    : "text-gray-900"
                }`}
              >
                {category.title}
              </motion.button>
            ) : (
              <h3 className="text-gray-900 font-bold text-xs">
                {category.title}
              </h3>
            )}

            <div className="flex flex-col gap-2">
              {category.items.map((item, itemIndex) => {
                const isSelected = selected.includes(item.value);

                return (
                  <motion.button
                    key={item.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: categoryIndex * 0.1 + itemIndex * 0.05,
                    }}
                    onClick={() => handleSelect(item.value)}
                    className="flex items-center gap-2.5 group"
                  >
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          isSelected
                            ? "border-brand bg-brand"
                            : "border-gray-400 group-hover:border-gray-600"
                        }`}
                      />
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute w-2.5 h-2.5"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 6L5 9L10 3"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      )}
                    </div>

                    <span
                      className={`text-xs transition-all ${
                        isSelected
                          ? "text-gray-900 font-medium"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <nav className={`${absolute ? "absolute left-0 top-0 z-30" : ""}`}>
      {/* 토글 버튼 + 메뉴 패널을 하나의 블록으로 세로 중앙 정렬 (패널은 항상 DOM에 있어 높이가 처음부터 동일) */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-stretch max-h-[min(100vh,100dvh)]">
        {/* 햄버거 / X 토글 버튼 */}
        <motion.button
          type="button"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="w-12 h-12 bg-brand flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-brand"
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative w-5 h-5 block">
            {/* 햄버거 세 줄 */}
            <motion.span
              className="absolute left-0 w-5 h-0.5 bg-white rounded-full block"
              initial={false}
              animate={{
                top: isMenuOpen ? "50%" : "0%",
                y: isMenuOpen ? "-50%" : 0,
                rotate: isMenuOpen ? 45 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 top-1/2 w-5 h-0.5 bg-white rounded-full block -translate-y-1/2"
              initial={false}
              animate={{
                opacity: isMenuOpen ? 0 : 1,
                x: isMenuOpen ? -8 : 0,
              }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="absolute left-0 w-5 h-0.5 bg-white rounded-full block"
              initial={false}
              animate={{
                top: isMenuOpen ? "50%" : "90%",
                y: isMenuOpen ? "-50%" : 0,
                rotate: isMenuOpen ? -45 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          </span>
        </motion.button>

        {/* 메뉴 패널: 항상 DOM에 두고 닫을 때만 화면 밖으로 슬라이드 → 블록 높이가 처음부터 동일해 토글 위치 고정 */}
        <motion.aside
          className={`nav-panel-scroll w-[min(320px,85vw)] min-h-0 flex-1 max-h-[min(80vh,80dvh)] bg-white pl-6 py-6 overflow-y-auto transition-shadow duration-200 ${
            isMenuOpen
              ? "shadow-[4px_0_24px_-4px_rgba(0,0,0,0.15),4px_0_12px_-2px_rgba(0,0,0,0.08)]"
              : "shadow-none"
          }`}
          initial={false}
          animate={{ x: isMenuOpen ? 0 : "-100%" }}
          transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
          aria-label="사이드 내비게이션"
          aria-hidden={!isMenuOpen}
          style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}
        >
          {navContent}
        </motion.aside>
      </div>
    </nav>
  );
}
