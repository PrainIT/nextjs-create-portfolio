"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { type SanityDocument } from "next-sanity";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface AboutPageClientProps {
  about: SanityDocument;
}

// 슬롯 머신 애니메이션 숫자 컴포넌트
function AnimatedNumber({ value }: { value: number | [number, number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);
  const [displayValue2, setDisplayValue2] = useState(0);
  const motionValue = useMotionValue(0);
  const motionValue2 = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 50,
    stiffness: 450,
  });
  const spring2 = useSpring(motionValue2, {
    damping: 50,
    stiffness: 450,
  });

  // 배열인 경우 (예: [6, 50])
  if (Array.isArray(value)) {
    useEffect(() => {
      if (isInView) {
        motionValue.set(value[0]);
        motionValue2.set(value[1]);
      }
    }, [motionValue, motionValue2, isInView, value]);

    useEffect(() => {
      const unsubscribe1 = spring.on("change", (latest) => {
        setDisplayValue(Math.floor(latest));
      });
      const unsubscribe2 = spring2.on("change", (latest) => {
        setDisplayValue2(Math.floor(latest));
      });
      return () => {
        unsubscribe1();
        unsubscribe2();
      };
    }, [spring, spring2]);

    return (
      <motion.h3
        ref={ref}
        className="text-white text-5xl font-bold mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {displayValue}/{displayValue2}
      </motion.h3>
    );
  }

  // 단일 숫자인 경우
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
      className="text-white text-5xl font-bold mb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue}
    </motion.h3>
  );
}

// 통계 섹션 컴포넌트
function StatsSection() {
  const stats = [
    { value: 3000, label: "프로젝트 수주 건수", label2: "3000여 건의 프로젝트를\n 진행하여다양한 경험과\n 노하우를 축적하였습니다." },
    { value: 1, label: "대한민국 유일 국내 최대", label2: "프레인글로벌은 해외 PR Awards에서\n대상을 수상한 국내 유일, 국내 최대의\nPR 전문 기업입니다." },
    { value: [6, 50] as [number, number], label: "아시아 6위/세계 50위", label2: "프레인글로벌은 세계적으로\n인정받고 있는 국내 최고의\n커뮤니케이션 컨설팅 기업입니다." },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-24">
      <div className="flex gap-12 justify-center items-center">
        {stats.flatMap((stat, index) => [
          <div key={`stat-${index}`} className="flex-1 min-w-0 flex flex-col items-center justify-center text-center">
            <AnimatedNumber value={stat.value} />
            <p className="text-white text-xl opacity-80 mb-1">{stat.label}</p>
            <p className="text-white text-xs opacity-40 whitespace-pre-line">{stat.label2}</p>
          </div>,
          ...(index < stats.length - 1
            ? [<div key={`divider-${index}`} className="w-px self-stretch bg-white opacity-20 shrink-0" />]
            : []),
        ])}
      </div>
    </div>
  );
}



export default function AboutPageClient({
  about,
}: AboutPageClientProps) {
  const router = useRouter();

  return (
    <main className="w-full">
      

      <div className="flex flex-col gap-4 max-w-[850px] mb-8 pt-60 mx-auto">
        {about.title && (
          <h1 className="text-white text-7xl font-bold text-center break-words">
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

      

      <StatsSection />

      <div className="flex justify-center mt-24 mb-60">
        <button
          onClick={() => router.push("/contact")}
          className="bg-[#272727] text-white px-2 py-4 rounded-full min-w-40 w-[200px] hover:opacity-80 transition-all duration-300"
        >
          CONTACT
        </button>
      </div>

      {/* 하단 선 */}
      <div className="w-full h-px bg-white mt-12 opacity-40" />

      {/* 저작권 텍스트 */}
      <div className="text-center py-6">
        <p className="text-white opacity-40 text-sm">
          © 2025. PRAIN GLOBAL CREATIVE PART. All rights reserved.
        </p>
      </div>
    </main>
  );
}
