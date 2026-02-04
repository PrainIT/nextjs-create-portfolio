"use client";

import { useState } from "react";
import Image from "next/image";
import SearchAndFilter from "./SearchAndFilter";

export default function ContentSection() {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="relative w-full">
      {/* aspect-ratio로 이미지 로딩 전 공간 예약 → CLS 방지 */}
      <div className="relative w-full aspect-[2880/1800] min-h-[280px] overflow-hidden bg-black/20">
        <Image
          src="/MainHeroImage.png"
          alt="메인 히어로 콘텐츠 모음"
          width={2880}
          height={1800}
          className="object-cover"
          sizes="100vw"
          quality={90}
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/AL+ptqN3qNxcSXty7yOWZmckk0pSlYz/2Q=="
        />
      </div>
      <div className="absolute inset-0 z-10 flex items-start justify-center pt-12 md:pt-20 lg:pt-28">
        <SearchAndFilter
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
        />
      </div>
    </div>
  );
}
