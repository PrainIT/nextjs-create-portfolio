"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Logo {
  name: string;
  logo?: string;
}

interface SocialLink {
  name: string;
  logo?: string;
  url: string;
}

interface LogoSliderProps {
  logos: Logo[];
  socialLinks?: SocialLink[];
}

export default function LogoSlider({
  logos,
  socialLinks = [],
}: LogoSliderProps) {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);
  const [repeatCount, setRepeatCount] = useState(3); // 기본값 3번

  const hasLogos = logos && logos.length > 0;

  // 첫 번째 세트(원본 logos 배열)의 전체 너비를 측정하고 동적 keyframes 생성
  useEffect(() => {
    if (!sliderRef.current || !hasLogos) return;

    // 요소가 완전히 렌더링된 후 측정하기 위해 requestAnimationFrame 사용
    const measureWidth = () => {
      if (!sliderRef.current) return;

      // 첫 번째 세트의 모든 로고 요소 찾기
      const firstSetElements = Array.from(
        sliderRef.current.querySelectorAll('[data-set-index="0"]')
      ) as HTMLElement[];

      if (firstSetElements.length === 0) {
        // 아직 렌더링되지 않았으면 다시 시도
        requestAnimationFrame(measureWidth);
        return;
      }

      // 첫 번째 요소의 left 위치
      const firstLeft = firstSetElements[0].offsetLeft;
      // 마지막 요소의 right 위치 (left + width)
      const lastElement = firstSetElements[firstSetElements.length - 1];
      const lastRight = lastElement.offsetLeft + lastElement.offsetWidth;
      // 한 세트의 전체 너비 계산 (마진 포함)
      const setWidth = lastRight - firstLeft + 96; // mx-12 = 48px * 2 = 96px

      if (setWidth > 0) {
        setSingleSetWidth(setWidth);

        // 화면 너비를 측정하여 필요한 반복 횟수 계산
        const viewportWidth = window.innerWidth;
        // 화면을 꽉 채우기 위해 최소 2-3배는 필요 (무한 스크롤을 위해)
        // 한 세트 너비가 화면보다 작으면 더 많이 반복
        const minRepeatCount = Math.ceil((viewportWidth * 2.5) / setWidth);
        // 최소 3번은 반복 (무한 스크롤을 위해), 최대는 적당히 제한
        const calculatedRepeatCount = Math.max(3, Math.min(minRepeatCount, 20));
        setRepeatCount(calculatedRepeatCount);

        // 동적으로 keyframes 생성
        const styleId = "logo-slider-keyframes";
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;

        if (!styleElement) {
          styleElement = document.createElement("style");
          styleElement.id = styleId;
          document.head.appendChild(styleElement);
        }

        // 정확한 거리만큼 이동하도록 keyframes 설정
        styleElement.textContent = `
          @keyframes slide-infinite-smooth {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-${setWidth}px, 0, 0);
            }
          }
        `;
      }
    };

    // 초기 측정 시도
    requestAnimationFrame(measureWidth);

    // 리사이즈 이벤트 리스너 추가
    const handleResize = () => {
      requestAnimationFrame(measureWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [logos.length, hasLogos]);

  // 반복 횟수에 따라 로고 배열 복제 (메모이제이션으로 최적화)
  const duplicatedLogos = useMemo(
    () =>
      hasLogos ? Array.from({ length: repeatCount }, () => logos).flat() : [],
    [logos, repeatCount, hasLogos]
  );

  return (
    <section className="w-full bg-[#1A1A1A] py-12 border-b border-grey-800">
      <div className="relative overflow-hidden">
        {/* 상단 선 */}
        <div className="absolute top-0 left-0 right-0 h-px bg-grey-700" />
        {/* 로고 슬라이더 */}
        <div className="flex items-center justify-center py-20">
          <div className="relative w-full overflow-hidden">
            {hasLogos ? (
              <div
                ref={sliderRef}
                className="flex"
                style={{
                  width: "fit-content",
                  willChange: "transform",
                  transform: "translateZ(0)", // GPU 가속 강제
                  // 동적으로 계산된 애니메이션 적용
                  ...(singleSetWidth > 0
                    ? {
                        // 정확히 한 세트의 너비만큼 이동 (끊김 없이 부드럽게)
                        animation: `slide-infinite-smooth ${Math.max(singleSetWidth / 40, 15)}s linear infinite`,
                      }
                    : {
                        // 초기 로딩 시 fallback 애니메이션
                        animation: "slide-infinite 20s linear infinite",
                      }),
                }}
              >
                {duplicatedLogos.map((logo, index) => {
                  const setIndex = Math.floor(index / logos.length);
                  return (
                    <div
                      key={`${logo.name}-${index}`}
                      data-set-index={setIndex}
                      className="flex-shrink-0 mx-12 flex items-center justify-center"
                      style={{
                        height: "40px", // 현재 텍스트 크기와 비슷한 높이
                        width: "auto",
                      }}
                    >
                      {logo.logo ? (
                        <Image
                          src={logo.logo}
                          alt={logo.name}
                          width={120}
                          height={40}
                          className="object-contain"
                          style={{
                            maxHeight: "40px",
                            width: "auto",
                            filter: "brightness(0.7)", // 텍스트 색상과 비슷하게
                          }}
                        />
                      ) : (
                        <span className="text-grey-400 text-2xl font-medium whitespace-nowrap">
                          {logo.name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <span className="text-grey-400 text-2xl font-medium whitespace-nowrap">
                  준비중
                </span>
              </div>
            )}
          </div>
        </div>
        {/* 하단 선 */}
        <div className="w-full h-px bg-grey-700 mb-2" />
      </div>

      <div className="flex flex-row items-center items-start mt-12">
        <div className="flex flex-col gap-12">
          <div className="text-3xl font-medium ">
            함께하면 더 좋은 일들,
            <br />
            편하게 연락해주세요!
          </div>
          <div className="flex flex-row gap-4">
            {socialLinks.length > 0 ? (
              socialLinks.slice(0, 3).map((link, index) => (
                <a
                  key={`social-${link.name}-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ height: "28px" }}
                >
                  {link.logo ? (
                    <Image
                      src={link.logo}
                      alt={link.name}
                      width={80}
                      height={28}
                      className="object-contain"
                      style={{
                        maxHeight: "28px",
                        width: "auto",
                        filter: "brightness(0.7)",
                      }}
                    />
                  ) : (
                    <span className="text-grey-400 text-xl font-medium whitespace-nowrap">
                      {link.name}
                    </span>
                  )}
                </a>
              ))
            ) : (
              <span className="text-grey-400 text-xl font-medium whitespace-nowrap">
                준비중
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-8 ml-32">
          <div className="text-base text-grey-400">
            서로의 강점을 신뢰하며 아이디어를 확장시킵니다.
            <br />
            각자의 전문 분야가 하나의 완성된 결과로 자연스럽게 이어집니다.
            <br />
            혼자보다 함께할 때 더 뛰어난 크리에이티브를 만들어냅니다.
          </div>
          <button
            onClick={() => router.push("/contact")}
            className="bg-brand text-white px-2 py-4 rounded-full min-w-40 w-[200px] hover:opacity-80 transition-all duration-300"
          >
            CONTACT
          </button>
        </div>
      </div>

      {/* 하단 선 */}
      <div className="w-full h-px bg-grey-700 mt-12" />

      {/* 저작권 텍스트 */}
      <div className="text-center py-6">
        <p className="text-grey-500 text-sm">
          © 2025. PRAIN GLOBAL CREATIVE PART. All rights reserved.
        </p>
      </div>
    </section>
  );
}
