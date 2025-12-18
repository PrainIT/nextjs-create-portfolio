"use client";

import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { PortableText, type SanityDocument } from "next-sanity";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface ContentCard {
  image?: {
    asset?: {
      _ref?: string;
    };
  };
  link?: string;
}

interface AboutPageClientProps {
  about: SanityDocument;
  mainImageUrl: string | null;
  contentCards?: ContentCard[];
  contentCardImageUrls?: (string | null)[];
}

// 슬롯 머신 애니메이션 숫자 컴포넌트
function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return () => unsubscribe();
  }, [spring]);

  return (
    <motion.h3
      ref={ref}
      className="text-brand text-5xl font-bold mb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue}+
    </motion.h3>
  );
}

// 통계 섹션 컴포넌트
function StatsSection() {
  const stats = [
    { value: 595, label: "Donation Received" },
    { value: 595, label: "Donation Received" },
    { value: 595, label: "Donation Received" },
  ];

  return (
    <div className="flex gap-8 justify-center items-center mt-16">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <AnimatedNumber value={stat.value} />
            <p className="text-grey-300 text-xl mb-1">{stat.label}</p>
            <p className="text-grey-500 text-xs">{stat.label}</p>
            <p className="text-grey-500 text-xs">{stat.label}</p>
          </div>
          {index < stats.length - 1 && (
            <div className="h-20 w-px bg-grey-600 ml-8" />
          )}
        </div>
      ))}
    </div>
  );
}

// 가로 나열 콘텐츠 카드 컴포넌트
function ContentSlider({
  cards,
  imageUrls,
}: {
  cards: ContentCard[];
  imageUrls: (string | null)[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      // 가운데(50%) 위치로 스크롤
      container.scrollLeft = maxScroll / 2;
    }
  }, [cards.length]);

  if (cards.length === 0) return null;

  return (
    <div
      ref={scrollContainerRef}
      className="w-full overflow-x-auto mt-16 scrollbar-hide"
    >
      <div className="flex gap-6 pl-8 pr-8">
        {cards.map((card, index) => {
          const imageUrl = imageUrls[index];

          const cardContent = (
            <div
              key={`card-${index}`}
              className="flex-shrink-0 w-[850px] h-[450px] bg-grey-800 rounded-2xl overflow-hidden border-2 border-grey-400"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`Content card ${index + 1}`}
                  width={850}
                  height={450}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-grey-700 flex items-center justify-center">
                  <p className="text-grey-500">No Image</p>
                </div>
              )}
            </div>
          );

          if (card.link) {
            return (
              <a
                key={`link-${index}`}
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 hover:opacity-90 transition-opacity"
              >
                {cardContent}
              </a>
            );
          }

          return (
            <div key={`wrapper-${index}`} className="flex-shrink-0">
              {cardContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AboutPageClient({
  about,
  mainImageUrl,
  contentCards = [],
  contentCardImageUrls = [],
}: AboutPageClientProps) {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  return (
    <main className="w-full">
      <NavBar
        pageName="ABOUT"
        title=""
        showBackButton={true}
        onTitleClick={() => {
          router.push("/");
        }}
        categories={[]}
      />

      {/* 검색바 - 오른쪽 위 */}
      <div className="pl-64 pr-8 py-8">
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-[850px]">
            <SearchBar
              placeholder="SEARCH"
              onSearch={handleSearch}
              value={searchKeyword}
              onChange={(value) => {
                setSearchKeyword(value);
                handleSearch(value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 max-w-[850px] mb-8 mx-auto">
        {about.subtitle && (
          <h2 className="text-white text-2xl font-bold text-center break-words">
            {about.subtitle}
          </h2>
        )}
        {about.title && (
          <h1 className="text-brand text-7xl font-bold text-center break-words">
            {typeof about.title === "string"
              ? about.title
                  .split("\n")
                  .map((line: string, index: number, arr: string[]) => (
                    <span key={index}>
                      {line}
                      {index < arr.length - 1 && <br />}
                    </span>
                  ))
              : about.title}
          </h1>
        )}
      </div>

      {about.description && (
        <div className="flex flex-col gap-4 mt-16 max-w-[850px] mx-auto">
          <div className="text-grey-400 text-base font-normal text-center">
            <PortableText value={about.description} />
          </div>
        </div>
      )}

      <StatsSection />

      {contentCards.length > 0 ? (
        <div className="flex justify-center">
          <ContentSlider
            cards={contentCards}
            imageUrls={contentCardImageUrls}
          />
        </div>
      ) : (
        mainImageUrl && (
          <div className="flex justify-center mt-16">
            <div className="w-full max-w-[850px] h-[450px] border-2 border-grey-400 rounded-2xl overflow-hidden">
              <Image
                src={mainImageUrl}
                alt="about-main"
                width={940}
                height={529}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )
      )}

      <div className="flex justify-center mt-12 mb-60">
        <button
          onClick={() => router.push("/contact")}
          className="bg-brand text-white px-2 py-4 rounded-full min-w-40 w-[200px] hover:opacity-80 transition-all duration-300"
        >
          CONTACT
        </button>
      </div>

      {/* 하단 선 */}
      <div className="w-full h-px bg-grey-700 mt-12" />

      {/* 저작권 텍스트 */}
      <div className="text-center py-6">
        <p className="text-grey-500 text-sm">
          © 2025. PRAIN GLOBAL CREATIVE PART. All rights reserved.
        </p>
      </div>
    </main>
  );
}
