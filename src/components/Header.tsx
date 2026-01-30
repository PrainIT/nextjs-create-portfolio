"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [portfolioUrl, setPortfolioUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 스크롤 방향 감지
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 맨 위에서는 항상 보이게
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // 스크롤 내리면 숨김
        setIsVisible(false);
      } else {
        // 스크롤 올리면 보임
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // API 라우트를 통해 포트폴리오 링크 가져오기
    const fetchPortfolioLink = async () => {
      try {
        const response = await fetch("/api/portfolio-download");
        
        if (!response.ok) {
          // API에서 반환한 에러 메시지 확인
          let errorMessage = "포트폴리오 링크를 가져올 수 없습니다.";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // JSON 파싱 실패 시 기본 메시지 사용
            errorMessage = `포트폴리오 링크를 가져올 수 없습니다. (${response.status})`;
          }
          console.error("포트폴리오 링크 API 오류:", errorMessage);
          return;
        }

        const data = await response.json();
        
        if (data.url) {
          setPortfolioUrl(data.url);
        } else {
          console.warn("포트폴리오 링크가 응답에 포함되어 있지 않습니다.");
        }
      } catch (error) {
        // 네트워크 에러 또는 기타 예외 처리
        if (error instanceof TypeError && error.message.includes("fetch")) {
          console.error("네트워크 오류: 포트폴리오 링크를 가져올 수 없습니다.", error);
        } else if (error instanceof SyntaxError) {
          console.error("JSON 파싱 오류: 서버 응답을 파싱할 수 없습니다.", error);
        } else {
          console.error("포트폴리오 링크를 가져오는 중 예상치 못한 오류:", error);
        }
      }
    };

    fetchPortfolioLink();
  }, []);

  // 현재 경로가 링크와 일치하는지 확인하는 함수
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Home 또는 About 페이지인지 확인
  const isHomeOrAbout = pathname === "/" || pathname === "/about";

  // 링크 스타일 클래스 생성 함수
  const getLinkClassName = (href: string) => {
    if (isHomeOrAbout) {
      // Home, About 페이지일 때: 현재 색상 유지
      return `text-secondary-4 text-sm transition-opacity ${
        isActive(href) ? "opacity-100" : "opacity-50 hover:opacity-100"
      }`;
    } else {
      // 나머지 페이지일 때: #000000 opacity-20, hover 시 #FF6B00
      return `text-sm transition-colors ${
        isActive(href)
          ? "text-[#FF6B00]"
          : "text-[#000000] opacity-20 hover:text-[#FF6B00] hover:opacity-100"
      }`;
    }
  };

  return (
    <header
      className={`fixed top-10 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-[1000%]"
      }`}
    >
      <nav className="flex items-center justify-between px-12">
        <div className="flex items-center gap-12">
          <Link href="/" className={getLinkClassName("/")}>
            HOME
          </Link>
          <Link href="/about" className={getLinkClassName("/about")}>
            ABOUT
          </Link>
          <Link href="/branded" className={getLinkClassName("/branded")}>
            BRANDED
          </Link>
          <Link href="/content" className={getLinkClassName("/content")}>
            CONTENT
          </Link>
          <Link href="/contact" className={getLinkClassName("/contact")}>
            CONTACT
          </Link>
        </div>
        <div className="flex items-center">
          {portfolioUrl ? (
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm transition-opacity opacity-100 hover:opacity-80 cursor-pointer ${
                isHomeOrAbout ? "text-white" : "text-brand"
              }`}
            >
              PORTFOLIO DOWNLOAD
            </a>
          ) : (
            <span className={`text-sm opacity-50 cursor-not-allowed ${
              isHomeOrAbout ? "text-white" : "text-brand"
            }`}>
              PORTFOLIO DOWNLOAD
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}
