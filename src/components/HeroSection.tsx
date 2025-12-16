"use client";

import { motion, useAnimationControls, useMotionValue } from "framer-motion";
import { useState, useEffect } from "react";

const companies = [
  {
    name: "ZESPRI",
    highlighted: false,
    top: "20vh",
    left: "4vw",
  },
  {
    name: "YUHAN-KIMBERLY",
    highlighted: false,
    top: "38%",
    left: "-14vw", // 화면 밖으로
  },
  {
    name: "ASTRAZENECA",
    highlighted: false,
    bottom: "18vh",
    left: "14vw",
  },
  {
    name: "POSCO FUTURE",
    highlighted: false,
    top: "5vh",
    right: "-5vw", // 화면 밖으로
  },
  {
    name: "JIMMY JOHN'S",
    highlighted: true,
    top: "50%",
    right: "1.5vw",
    transform: "translateY(-30%)",
  },
];

interface CompanyCardProps {
  company: (typeof companies)[0];
  index: number;
  startX: string;
  endX: string;
  duration: number;
}

function CompanyCard({
  company,
  index,
  startX,
  endX,
  duration,
}: CompanyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimationControls();
  const x = useMotionValue(startX);

  useEffect(() => {
    // x 값 변경 추적
    const unsubscribe = x.on("change", (latest) => {
      // x 값이 변경될 때마다 추적 (필요시 사용)
    });

    return () => unsubscribe();
  }, [x]);

  useEffect(() => {
    // 초기 애니메이션 시작
    const timer = setTimeout(
      () => {
        controls.start({
          opacity: 1,
          y: 0,
          x: [startX, endX],
          transition: {
            opacity: { duration: 0.2 },
            y: { duration: 0.2 },
            x: {
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0,
            },
          },
        });
      },
      index * 500 + 200
    );

    return () => clearTimeout(timer);
  }, [controls, startX, endX, duration, index]);

  useEffect(() => {
    if (isHovered) {
      // hover 시 현재 위치에서 멈춤
      const currentXValue = x.get();
      controls.stop();
      controls.set({ x: currentXValue });
    } else {
      // hover 해제 시 현재 위치에서 다시 애니메이션 시작
      const currentXValue = x.get();
      controls.start({
        x: [currentXValue, endX],
        transition: {
          x: {
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0,
          },
        },
      });
    }
  }, [isHovered, controls, endX, duration, x]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: startX }}
      animate={controls}
      style={{
        x,
        top: company.top,
        left: company.left,
        right: company.right,
        bottom: company.bottom,
        transform: company.transform,
      }}
      className="absolute"
    >
      <motion.div
        className="relative rounded-full overflow-hidden cursor-pointer"
        style={{
          height: "77px",
          padding: "14px 21px",
          fontSize: "40px",
          borderRadius: "100px",
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{
          scale: 1.05,
          x: company.left?.startsWith("-")
            ? 20
            : company.right?.startsWith("-")
              ? -20
              : 0,
        }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {/* 배경 레이어 - blur와 opacity 적용 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
          animate={{
            opacity: isHovered ? 0.9 : 0.8,
            background: isHovered
              ? "rgba(255, 106, 0, 0.7)"
              : "rgba(0, 0, 0, 0.5)",
          }}
          transition={{ duration: 0.2 }}
        />

        {/* 내부 광택 효과 */}
        <div
          className="absolute inset-1 rounded-full pointer-events-none"
          style={{
            boxShadow:
              "inset 4px 4px 20px rgba(255, 255, 255, 0.3), inset 4px -4px 20px rgba(0, 0, 0, 0.5)",
          }}
        />

        {/* 하단 밝은 반사광 */}
        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-full pointer-events-none"
          style={{
            height: "33%",
            background:
              "linear-gradient(to top, rgba(255, 255, 255, 0.2), transparent)",
          }}
        />

        {/* 테두리 하이라이트 */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `
                    inset 1px 1px 1px 0 rgba(255, 255, 255, 0.8),
                    inset -1px -1px 1px 0 rgba(255, 255, 255, 0.2)
                  `,
          }}
        />

        {/* 외부 그림자 */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          }}
        />

        {/* 텍스트 - blur 영향 없음 */}
        <motion.span
          className="relative z-10 flex items-center justify-center font-bold whitespace-nowrap"
          style={{
            height: "100%",
          }}
          animate={{
            color: isHovered ? "#FF6B00" : "#4a4a4a",
          }}
          transition={{ duration: 0.2 }}
        >
          {company.name}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-visible">
      {/* 글로우 효과는 globals.css의 body::before, body::after로 처리됨 */}

      {/* 메인 텍스트 - 뒤로 이동 (z-index 낮춤) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div
          className="text-center font-extrabold text-white"
          style={{
            fontSize: "clamp(80px, 15vw, 200px)",
            lineHeight: "1",
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5 }}
            style={{ display: "inline-block" }}
          >
            TOGETHER
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.5 }}
            style={{ display: "inline-block" }}
          >
            WE CREATE
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 2.5 }}
            style={{ display: "inline-block" }}
          >
            BETTER
          </motion.span>
        </div>
      </div>

      {/* 회사 라벨들 - 앞으로 이동 (z-index 높임) */}
      <div
        className="absolute inset-0 overflow-hidden z-20"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        {companies.map((company, index) => {
          // 각 라벨마다 다른 속도 설정
          const duration = 10 + index * 0.6;

          // 모두 왼쪽에서 오른쪽으로 이동
          const startX = "-80vw"; // 화면 왼쪽 밖에서 시작
          const endX = "80vw"; // 화면 오른쪽 밖으로 이동

          return (
            <CompanyCard
              key={company.name}
              company={company}
              index={index}
              startX={startX}
              endX={endX}
              duration={duration}
            />
          );
        })}
      </div>
    </section>
  );
}
