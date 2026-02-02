"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { format, parse, isValid } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

function parseDateSafe(value: string): Date | undefined {
  if (!value.trim()) return undefined;
  try {
    const d = parse(value.trim(), "yyyy-MM-dd", new Date());
    return isValid(d) ? d : undefined;
  } catch {
    return undefined;
  }
}

const PROJECT_TYPES = [
  "영상",
  "이미지",
  "AI콘텐츠",
  "사진",
  "캠페인",
  "그외 유형",
] as const;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    companyOrName: "",
    contact: "",
    email: "",
    projectType: "",
    content: "",
    budget: "",
    startDate: "",
    endDate: "",
  });
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const startDateAnchorRef = useRef<HTMLDivElement>(null);
  const endDateAnchorRef = useRef<HTMLDivElement>(null);
  const [startDatePopoverWidth, setStartDatePopoverWidth] = useState<
    number | undefined
  >(undefined);
  const [endDatePopoverWidth, setEndDatePopoverWidth] = useState<
    number | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 캘린더 팝오버 너비를 인풋(앵커)과 동일하게
  useEffect(() => {
    if (!startDateOpen || !startDateAnchorRef.current) return;
    const el = startDateAnchorRef.current;
    const update = () => setStartDatePopoverWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [startDateOpen]);
  useEffect(() => {
    if (!endDateOpen || !endDateAnchorRef.current) return;
    const el = endDateAnchorRef.current;
    const update = () => setEndDatePopoverWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [endDateOpen]);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const body = new FormData();
      body.append("companyOrName", formData.companyOrName.trim());
      body.append("contact", formData.contact.trim());
      body.append("email", formData.email.trim());
      body.append("projectType", formData.projectType);
      body.append("content", formData.content.trim());
      body.append("budget", formData.budget.trim());
      body.append("startDate", formData.startDate.trim());
      body.append("endDate", formData.endDate.trim());
      if (referenceFile) {
        body.append("reference", referenceFile);
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: data.message || "문의가 성공적으로 전송되었습니다.",
        });
        setFormData({
          companyOrName: "",
          contact: "",
          email: "",
          projectType: "",
          content: "",
          budget: "",
          startDate: "",
          endDate: "",
        });
        setReferenceFile(null);
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "문의 전송 중 오류가 발생했습니다.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full">
      {/* 제목 섹션 */}
      <div className="flex flex-col gap-4 max-w-[850px] mb-8 mx-auto pt-40">
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
          <br />
          프로젝트 의뢰 및 문의는 프로젝트 리퀘스트를 간단히 작성해 보내주시면
          회신드리겠습니다.
        </p>
      </div>

      {/* 폼 */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 max-w-[550px] mx-auto mt-20"
      >
        <input
          type="text"
          name="companyOrName"
          value={formData.companyOrName}
          onChange={handleInputChange}
          placeholder="회사명/담당자 성명"
          className="w-full h-12 rounded-md bg-white border border-grey-200 px-4 text-grey-800 text-sm text-center placeholder:text-grey-400 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-brand"
          required
        />
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleInputChange}
          placeholder="연락처"
          className="w-full h-12 rounded-md bg-white border border-grey-200 px-4 text-grey-800 text-sm text-center placeholder:text-grey-400 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-brand"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="이메일"
          className="w-full h-12 rounded-md bg-white border border-grey-200 px-4 text-grey-800 text-sm text-center placeholder:text-grey-400 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-brand"
          required
        />

        {/* 프로젝트 유형 */}
        <div className="flex flex-col gap-3">
          <p className="text-grey-400 text-sm text-center">프로젝트 유형</p>
          <div className="grid grid-cols-3 gap-2">
            {PROJECT_TYPES.map((type) => (
              <motion.button
                key={type}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    projectType: prev.projectType === type ? "" : type,
                  }))
                }
                className={`h-10 rounded-lg text-sm font-medium transition-colors focus:outline-none ${
                  formData.projectType === type
                    ? "bg-brand text-white"
                    : "bg-grey-200 text-grey-400 border border-grey-300 hover:bg-grey-400 hover:text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>

        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="내용을 간단히 작성해주세요."
          rows={6}
          className="w-full rounded-md bg-white border border-grey-200 px-4 py-3 text-grey-800 text-sm text-center placeholder:text-grey-400 placeholder:text-center resize-none focus:outline-none focus:ring-2 focus:ring-brand"
        />

        <input
          type="text"
          name="budget"
          value={formData.budget}
          onChange={handleInputChange}
          placeholder="예산(논의 후 결정 가능)"
          className="w-full h-12 rounded-md bg-white border border-grey-200 px-4 text-grey-800 text-sm text-center placeholder:text-grey-400 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-brand"
        />

        <div className="grid grid-cols-2 gap-4">
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverAnchor asChild>
              <div ref={startDateAnchorRef} className="w-full">
                <input
                  type="text"
                  name="startDate"
                  readOnly
                  value={formData.startDate}
                  onClick={() => setStartDateOpen(true)}
                  placeholder="프로젝트 시작 예상일"
                  className="w-full h-12 rounded-md bg-white border border-grey-200 px-4 text-grey-800 text-sm text-center placeholder:text-grey-400 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer"
                />
              </div>
            </PopoverAnchor>
            <PopoverContent
              className="p-0"
              align="start"
              style={
                startDatePopoverWidth != null
                  ? { width: startDatePopoverWidth }
                  : undefined
              }
            >
              <Calendar
                mode="single"
                selected={parseDateSafe(formData.startDate)}
                onSelect={(date) => {
                  if (date) {
                    setFormData((prev) => ({
                      ...prev,
                      startDate: format(date, "yyyy-MM-dd"),
                    }));
                    setStartDateOpen(false);
                  }
                }}
                captionLayout="dropdown"
                locale={ko}
              />
            </PopoverContent>
          </Popover>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverAnchor asChild>
              <div ref={endDateAnchorRef} className="w-full">
                <input
                  type="text"
                  name="endDate"
                  readOnly
                  value={formData.endDate}
                  onClick={() => setEndDateOpen(true)}
                  placeholder="프로젝트 종료 예상일"
                  className="w-full h-12 rounded-md bg-white border border-grey-200 px-4 text-grey-800 text-sm text-center placeholder:text-grey-400 placeholder:text-center focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer"
                />
              </div>
            </PopoverAnchor>
            <PopoverContent
              className="p-0"
              align="start"
              style={
                endDatePopoverWidth != null
                  ? { width: endDatePopoverWidth }
                  : undefined
              }
            >
              <Calendar
                mode="single"
                selected={parseDateSafe(formData.endDate)}
                onSelect={(date) => {
                  if (date) {
                    setFormData((prev) => ({
                      ...prev,
                      endDate: format(date, "yyyy-MM-dd"),
                    }));
                    setEndDateOpen(false);
                  }
                }}
                captionLayout="dropdown"
                locale={ko}
              />
            </PopoverContent>
          </Popover>
        </div>

        <label className="flex flex-col gap-2 cursor-pointer">
          <div className="relative rounded-md bg-white border border-grey-200 px-4 py-3 min-h-12 flex items-center justify-center focus-within:ring-2 focus-within:ring-brand">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
              onChange={(e) => setReferenceFile(e.target.files?.[0] ?? null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="레퍼런스 파일 선택"
            />
            <span className="text-grey-500 text-sm text-center pointer-events-none w-full">
              {referenceFile ? referenceFile.name : "레퍼런스(첨부파일)"}
            </span>
          </div>
        </label>

        {submitStatus.type && (
          <div
            className={`px-4 py-3 rounded-md text-sm text-center ${
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
          disabled={isSubmitting || !formData.projectType}
          className="px-12 py-4 mt-8 rounded-full bg-brand text-white text-sm font-medium hover:opacity-80 transition-opacity whitespace-nowrap mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "전송 중..." : "CONTACT >"}
        </button>
      </form>

      {/* 하단 선 - 전체 너비 */}
      <div className="w-full h-px bg-grey-700 mt-24" />

      {/* 저작권 텍스트 */}
      <div className="w-full text-center py-6">
        <p className="text-grey-500 text-sm">
          © 2025. PRAIN GLOBAL CREATIVE PART. All rights reserved.
        </p>
      </div>
    </main>
  );
}
