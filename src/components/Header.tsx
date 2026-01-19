"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("portfolio");

  useEffect(() => {
    // API 라우트를 통해 포트폴리오 다운로드 파일 가져오기
    const fetchPortfolioFile = async () => {
      try {
        const response = await fetch("/api/portfolio-download");
        
        if (!response.ok) {
          throw new Error("포트폴리오 파일을 가져올 수 없습니다.");
        }

        const data = await response.json();
        
        if (data.fileUrl) {
          // 다운로드를 위해 ?dl 파라미터 추가
          const fileUrl = `${data.fileUrl}?dl`;
          setDownloadUrl(fileUrl);
          setFileName(data.fileName || "portfolio");
        }
      } catch (error) {
        console.error("포트폴리오 파일을 가져오는 중 오류:", error);
      }
    };

    fetchPortfolioFile();
  }, []);

  // 현재 경로가 링크와 일치하는지 확인하는 함수
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="mt-[60px] mx-auto mb-[60px]">
      <nav className="flex items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={180}
            height={120}
            priority
            className="h-auto"
          />
        </Link>
        <div className="flex items-center gap-[55px]">
          <Link
            href="/about"
            className={`text-secondary-4 text-base transition-opacity ${
              isActive("/about")
                ? "opacity-100"
                : "opacity-50 hover:opacity-100"
            }`}
          >
            ABOUT
          </Link>
          <Link
            href="/branded"
            className={`text-secondary-4 text-base transition-opacity ${
              isActive("/branded") ? "opacity-100" : "opacity-50 hover:opacity-100"
            }`}
          >
            BRANDED
          </Link>
          <Link
            href="/content"
            className={`text-secondary-4 text-base transition-opacity ${
              isActive("/content") ? "opacity-100" : "opacity-50 hover:opacity-100"
            }`}
          >
            CONTENT
          </Link>
          <Link
            href="/contact"
            className={`text-secondary-4 text-base transition-opacity ${
              isActive("/contact")
                ? "opacity-100"
                : "opacity-50 hover:opacity-100"
            }`}
          >
            CONTACT
          </Link>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              download={fileName}
              className={`text-brand text-base transition-opacity opacity-100 hover:opacity-80 cursor-pointer`}
            >
              PORTFOLIO DOWNLOAD
            </a>
          ) : (
            <span className="text-brand text-base opacity-50 cursor-not-allowed">
              PORTFOLIO DOWNLOAD
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}
