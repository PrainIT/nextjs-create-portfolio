"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    /* h-screen 대신 min-h-screen을 사용하거나, 비디오 비율에 맡깁니다 */
    <section className="relative w-full bg-black overflow-hidden">
      
      {/* 1. 비디오 레이어: 컨테이너 역할을 하며 비율을 유지함 */}
      <div className="relative w-full z-0 bg-brand">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block object-cover invisible"
        >
          <source src="/preview.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. 텍스트 레이어: 비디오 정중앙에 절대 위치로 배치 */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.div
          className="text-center font-extrabold text-white"
          style={{
            fontSize: "clamp(40px, 15vw, 250px)", // 반응형 크기 조절
            lineHeight: "0.9",
          }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          (P)REATIVE<br />THINKING
        </motion.div>
      </div>

    </section>
  );
}