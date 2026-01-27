"use client";


export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-visible">
      {/* 배경 비디오 */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-screen max-w-none relative left-1/2 -translate-x-1/2"
        >
          <source src="/preview.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 메인 텍스트 - 영상 위에 표시 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div
          className="text-center font-extrabold text-white opacity-20"
          style={{
            fontSize: "clamp(80px, 15vw, 250px)",
            lineHeight: "1",
          }}
        >
          (P)REATIVE<br />THINKING
        </div>
      </div>

    </section>
  );
}
