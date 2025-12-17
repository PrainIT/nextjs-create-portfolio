"use client";

import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import { useState } from "react";
import { PortableText, type SanityDocument } from "next-sanity";

interface AboutPageClientProps {
  about: SanityDocument;
  mainImageUrl: string | null;
}

export default function AboutPageClient({
  about,
  mainImageUrl,
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

      {about.downloadButtonText && (
        <div className="flex justify-center mt-8">
          <button className="bg-brand text-white px-8 py-4 rounded-full whitespace-nowrap min-w-40 w-[200px] hover:opacity-80 transition-all duration-300 font-lg">
            {about.downloadButtonText}
          </button>
        </div>
      )}

      {about.description && (
        <div className="flex flex-col gap-4 mt-16 max-w-[850px] mx-auto">
          <div className="text-grey-400 text-base font-normal text-center">
            <PortableText value={about.description} />
          </div>
        </div>
      )}

      {mainImageUrl && (
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
      )}
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
