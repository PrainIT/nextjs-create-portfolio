"use client";

import React from "react";

const logos = [
  { name: "Behance", text: "Bē" },
  { name: "Google", text: "Google" },
  { name: "Apple", text: "Apple" },
  { name: "Dribbble", text: "dribbble" },
  { name: "Awwwards", text: "awwwards." },
];

export default function LogoSlider() {
  // 무한 스크롤을 위해 로고 배열을 2번 복제
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="w-full bg-[#1A1A1A] py-12 border-b border-grey-800 mt-100">
      <div className="relative overflow-hidden">
        {/* 상단 선 */}
        <div className="absolute top-0 left-0 right-0 h-px bg-grey-700" />
        {/* 로고 슬라이더 */}
        <div className="flex items-center justify-center py-20">
          <div className="relative w-full overflow-hidden">
            <div
              className="flex animate-slide-infinite"
              style={{
                width: "fit-content",
                willChange: "transform",
                transform: "translateZ(0)", // GPU 가속 강제
              }}
            >
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={`${logo.name}-${index}`}
                  className="flex-shrink-0 mx-12 text-grey-400 text-2xl font-medium whitespace-nowrap"
                >
                  {logo.text}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 하단 선 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-grey-700" />
      </div>

      <div className="flex flex-row items-center items-start mt-12">
        <div className="flex flex-col gap-12">
          <div className="text-3xl font-medium ">
            함께하면 더 좋은 일들,
            <br />
            편하게 연락해주세요!
          </div>
          <div className="flex flex-row gap-4">
            <div className="text-grey-400 text-xl font-medium whitespace-nowrap">
              {logos[0].text}
            </div>
            <div className="text-grey-400 text-xl font-medium whitespace-nowrap">
              {logos[1].text}
            </div>
            <div className="text-grey-400 text-xl font-medium whitespace-nowrap">
              {logos[2].text}
            </div>
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
          <button className="bg-brand text-white px-2 py-4 rounded-full min-w-40 w-[200px] hover:opacity-80 transition-all duration-300">
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
