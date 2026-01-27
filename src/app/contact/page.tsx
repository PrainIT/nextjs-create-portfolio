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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: data.message || "문의가 성공적으로 전송되었습니다.",
        });
        // 폼 초기화
        setFormData({
          name: "",
          projectInfo: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "문의 전송 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
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

      {/* 제목 섹션 */}
      <div className="flex flex-col gap-4 max-w-[850px] mb-8 mx-auto pt-40">
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
        className="flex flex-col gap-6 max-w-[550px] mx-auto mt-20"
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
        <label className="flex flex-col gap-2 mt-12">
          <span className="text-grey-400 text-sm">메시지</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full h-64 rounded-xl bg-white border border-grey-600 p-2 text-grey-600 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        {submitStatus.type && (
          <div
            className={`px-4 py-3 rounded-xl text-sm text-center ${
              submitStatus.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {submitStatus.message}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-12 py-4 mt-8 rounded-full bg-brand text-white text-sm font-medium hover:opacity-80 transition-opacity whitespace-nowrap mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "전송 중..." : "CONTACT >"}
        </button>
      </form>

      {/* 하단 선 - 전체 너비 */}
      <div className="w-full h-px bg-grey-700 mt-24" />

      {/* 저작권 텍스트 - 전체 너비 (navbar 영역 포함) */}
      <div className="w-full text-center py-6">
        <p className="text-grey-500 text-sm">
          © 2025. PRAIN GLOBAL CREATIVE PART. All rights reserved.
        </p>
      </div>
    </main>
  );
}
