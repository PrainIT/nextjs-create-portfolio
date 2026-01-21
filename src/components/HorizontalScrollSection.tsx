"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export interface ContentCard {
  id: string;
  title: string;
  description: string;
  subDescription: string;
  image?: string;
  slug?: string;
  subCategory?: string; // Industry 서브카테고리
}

interface HorizontalScrollSectionProps {
  cards: ContentCard[];
}

export default function HorizontalScrollSection({
  cards,
}: HorizontalScrollSectionProps) {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleCardClick = (slug?: string) => {
    if (slug) {
      router.push(`/branded/${slug}`);
    }
  };

  // 섹션 높이 및 가로 스크롤 효과
  useEffect(() => {
    if (!sectionRef.current || !carouselRef.current) return;

    const section = sectionRef.current;
    const carousel = carouselRef.current;
    let rafId: number | null = null;
    let ticking = false;

    // 카드가 변경되면 transform 초기화
    carousel.style.transform = "translate3d(0, 0, 0)";

    // 섹션 높이 동적 계산
    const cardCount = cards.length;
    const minHeight = 200;
    const heightPerCard = 50;
    const calculatedHeight = Math.max(minHeight, cardCount * heightPerCard);
    section.style.height = `${calculatedHeight}vh`;

    // 초기 측정값을 캐시 (transform 적용 전)
    const firstCard = carousel.firstElementChild as HTMLElement;
    if (!firstCard) return;

    // 측정 함수 분리
    const getMeasurements = () => {
      return {
        cardLeft: firstCard.offsetLeft,
        cardWidth: firstCard.offsetWidth,
        maxScrollWidth: carousel.scrollWidth - carousel.clientWidth,
      };
    };

    let measurements = getMeasurements();

    const updateTransform = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const sectionRect = section.getBoundingClientRect();

      // 섹션이 viewport에 없으면 스킵
      if (sectionRect.bottom < 0 || sectionRect.top > viewportHeight) {
        ticking = false;
        return;
      }

      // 섹션의 절대 스크롤 위치
      const sectionScrollTop = window.scrollY + sectionRect.top;

      // 첫 번째 카드 중앙이 화면 중앙에 오는데 필요한 이동 거리
      const cardCenterX = measurements.cardLeft + measurements.cardWidth / 2;
      const viewportCenterX = viewportWidth / 2;
      const distanceToCenter = cardCenterX - viewportCenterX;

      // 가로 스크롤 시작 지점
      const scrollStartPoint = sectionScrollTop + Math.max(0, distanceToCenter);

      // 스크롤 종료 지점
      const scrollableHeight = section.offsetHeight - viewportHeight;
      const scrollEndPoint = sectionScrollTop + scrollableHeight;

      // 가로 스크롤 구간의 길이
      const horizontalScrollRange = scrollEndPoint - scrollStartPoint;

      // 현재 스크롤 진행도 (0 ~ 1)
      const currentScroll = window.scrollY;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (currentScroll - scrollStartPoint) / horizontalScrollRange)
      );

      // Transform 적용
      const transformX = -scrollProgress * measurements.maxScrollWidth;
      carousel.style.transform = `translate3d(${transformX}px, 0, 0)`;

      // willChange 최적화
      carousel.style.willChange =
        scrollProgress > 0 && scrollProgress < 1 ? "transform" : "auto";

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateTransform);
        ticking = true;
      }
    };

    const handleResize = () => {
      // 리사이즈 시 측정값 재계산
      measurements = getMeasurements();
      carousel.style.transform = "translate3d(0, 0, 0)";

      // 섹션 높이 재계산
      const newHeight = Math.max(minHeight, cardCount * heightPerCard);
      section.style.height = `${newHeight}vh`;

      handleScroll();
    };

    // 초기 실행
    updateTransform();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (carousel) {
        carousel.style.willChange = "auto";
      }
    };
  }, [cards]);

  return (
    <section ref={sectionRef} className="w-full bg-[#1A1A1A] relative">
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full py-8 px-4">
          <div className="max-w-[1440px] mx-auto">
            <div className="relative overflow-hidden">
              <div
                ref={carouselRef}
                className="flex gap-6"
                style={{ willChange: "transform" }}
              >
                {cards.length > 0 ? (
                  cards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className={`lg:w-[407px] min-w-[307px] flex-shrink-0 ${card.slug ? 'cursor-pointer' : ''}`}
                      style={{ willChange: "transform, opacity" }}
                      onClick={() => handleCardClick(card.slug)}
                    >
                      <div className="bg-grey-800 rounded-2xl overflow-hidden aspect-[407/878] relative">
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

                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
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
                      표시할 콘텐츠가 없습니다.
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
