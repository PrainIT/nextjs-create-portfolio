"use client";

import { useState } from "react";
import Image from "next/image";
import SearchAndFilter from "./SearchAndFilter";

export default function ContentSection() {
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="relative w-full">
      <Image
        src="/MainHeroImage.png"
        alt="메인 히어로 콘텐츠 모음"
        width={1440}
        height={900}
        className="relative z-0 w-full h-auto object-cover"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 z-10 flex items-start justify-center pt-12 md:pt-20 lg:pt-28">
        <SearchAndFilter
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
        />
      </div>
    </div>
  );
}
