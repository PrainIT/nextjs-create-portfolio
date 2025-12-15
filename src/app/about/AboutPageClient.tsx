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

  const projectHistory = about.projectHistory || [];
  const awards = about.awards || [];

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

        <div className="flex flex-col gap-4 max-w-[850px]">
          {about.subtitle && (
            <h2 className="text-white text-2xl font-bold text-left break-words">
              {about.subtitle}
            </h2>
          )}
          {about.title && (
            <h1 className="text-brand text-7xl font-bold text-left break-words">
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
          <button className="bg-brand text-white px-8 py-4 mt-8 rounded-full whitespace-nowrap min-w-40 w-[200px] hover:opacity-80 transition-all duration-300 font-lg">
            {about.downloadButtonText}
          </button>
        )}

        {about.description && (
          <div className="flex flex-col gap-4 mt-16">
            <div className="text-grey-400 text-base font-normal text-left">
              <PortableText value={about.description} />
            </div>
          </div>
        )}

        {mainImageUrl && (
          <div className="w-full h-[500px] border-2 border-grey-400 rounded-2xl mt-16 overflow-hidden">
            <Image
              src={mainImageUrl}
              alt="about-main"
              width={940}
              height={529}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* PROJECT HISTORY */}
        {projectHistory.length > 0 && (
          <div className="mt-16">
            <h3 className="text-brand text-base font-bold mb-8 whitespace-nowrap text-left">
              PROJECT HISTORY
            </h3>
            <div className="grid grid-cols-3 gap-8">
              {projectHistory.map((history: any, index: number) => (
                <div key={index} className="flex flex-col gap-4">
                  <h4 className="text-white text-lg font-bold">
                    {history.year}
                  </h4>
                  <div className="flex flex-col gap-2 text-white text-sm">
                    {history.projects?.map(
                      (project: string, projectIndex: number) => (
                        <p key={projectIndex}>{project}</p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 구분선 */}
        <div className="w-full h-px bg-grey-700 my-16" />

        {/* AWARDS */}
        {awards.length > 0 && (
          <div className="mb-16">
            <h3 className="text-brand text-base font-bold mb-8 whitespace-nowrap text-left">
              AWARDS
            </h3>
            <div className="flex flex-col gap-4 text-white text-sm">
              {awards.map((award: string, index: number) => (
                <p key={index}>{award}</p>
              ))}
            </div>
          </div>
        )}
      </div>
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
