"use client";

import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";

export default function ContactPage() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    projectInfo: "",
    message: "",
  });

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출 로직 추가 가능
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="w-full">
      <div className="w-full h-px bg-grey-700 mt-12" />
      <NavBar
        pageName="CONTACT"
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
      {/* 제목 섹션 */}
      <div className="flex flex-col gap-4 max-w-[850px] mb-8 mx-auto">
        <h3 className="text-white text-2xl font-bold text-center">
          NICE TO MEET YOU
        </h3>
        <h1 className="text-brand text-6xl font-bold text-center break-words">
          WE ARE PR BRAIN
        </h1>
      </div>

      {/* 설명 텍스트 */}
      <div className="max-w-[850px] mb-12 mx-auto">
        <p className="text-grey-400 text-sm font-normal text-center">
          프레인글로벌 크리에이티브팀은 브랜딩, 모션 그래픽, 영상 제작, AI 등
          <br />
          각기 다른 전문성을 갖춘 26명의 전문가로 구성된 팀입니다.
        </p>
      </div>

      {/* 폼 */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 max-w-[550px] mx-auto mt-40"
      >
        <label className="flex flex-col gap-2">
          <span className="text-grey-400 text-sm">이름(필수)</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full h-12 rounded-xl bg-white border border-grey-600 p-2 text-grey-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-grey-400 text-sm">프로젝트 정보</span>
          <input
            type="text"
            name="projectInfo"
            value={formData.projectInfo}
            onChange={handleInputChange}
            className="w-full h-12 rounded-xl bg-white border border-grey-600 p-2 text-grey-600 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <label className="flex flex-col gap-2 mt-24">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full h-64 rounded-xl bg-white border border-grey-600 p-2 text-grey-600 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <button
          type="submit"
          className="px-12 py-4 mt-8 rounded-full bg-brand text-white text-sm font-medium hover:opacity-80 transition-opacity whitespace-nowrap mx-auto"
        >
          CONTACT &gt;
        </button>
      </form>

      {/* 하단 선 - 전체 너비 */}
      <div className="w-full h-px bg-grey-700 mt-12" />

      {/* 저작권 텍스트 - 전체 너비 (navbar 영역 포함) */}
      <div className="w-full text-center py-6">
        <p className="text-grey-500 text-sm">
          © 2025. PRAIN GLOBAL CREATIVE PART. All rights reserved.
        </p>
      </div>
    </main>
  );
}
