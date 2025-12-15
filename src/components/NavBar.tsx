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
  readonly items: readonly CategoryItem[];
}

interface NavBarProps {
  pageName: string;
  title: string;
  categories: readonly Category[];
  showBackButton?: boolean;
  backButtonHref?: string;
  selectedValue?: string;
  onSelect?: (value: string) => void;
  onTitleClick?: () => void;
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
}: NavBarProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(selectedValue || "");

  // selectedValue prop이 변경되면 내부 state도 업데이트
  useEffect(() => {
    setSelected(selectedValue || "");
  }, [selectedValue]);

  const handleBack = () => {
    if (backButtonHref) {
      router.push(backButtonHref);
    } else {
      router.back();
    }
  };

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect?.(value);
  };

  return (
    <nav className="absolute left-0 top-0 z-30 pl-8 py-8">
      <div className="flex flex-col gap-8">
        {/* HOME | PageName */}
        <div className="flex items-center gap-2 text-sm text-grey-400">
          <Link href="/" className="hover:text-grey-200 transition-colors">
            HOME
          </Link>
          <span className="text-grey-600">|</span>
          <span className="text-grey-200 font-medium">{pageName}</span>
        </div>

        {/* 제목 */}
        {onTitleClick ? (
          <button
            onClick={onTitleClick}
            className="text-white font-bold text-lg text-left hover:text-brand transition-colors cursor-pointer"
          >
            {title}
          </button>
        ) : (
          <h2 className="text-white font-bold text-lg">{title}</h2>
        )}

        {/* 뒤로가기 버튼 */}
        {showBackButton && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1 }}
            whileHover={{ x: -5 }}
            whileTap={{ x: -2 }}
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-grey-200 hover:text-grey-100 cursor-pointer transition-colors"
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

        {/* 카테고리별 메뉴 */}
        <div className="flex flex-col gap-8 mt-4">
          {categories.map((category, categoryIndex) => (
            <div key={category.title} className="flex flex-col gap-4">
              {/* 카테고리 제목 */}
              <h3 className="text-white font-bold text-sm">{category.title}</h3>

              {/* 카테고리 아이템들 */}
              <div className="flex flex-col gap-3">
                {category.items.map((item, itemIndex) => {
                  const isSelected = selected === item.value;

                  return (
                    <motion.button
                      key={item.value}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: categoryIndex * 0.1 + itemIndex * 0.05,
                      }}
                      onClick={() => handleSelect(item.value)}
                      className="flex items-center gap-3 group"
                    >
                      {/* 라디오 버튼 */}
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-brand bg-brand"
                              : "border-grey-500 group-hover:border-grey-400"
                          }`}
                        />
                        {isSelected && (
                          <motion.svg
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute w-3 h-3"
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

                      {/* 텍스트 */}
                      <span
                        className={`text-sm transition-all ${
                          isSelected
                            ? "text-white font-medium"
                            : "text-grey-400 group-hover:text-grey-200"
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
    </nav>
  );
}
