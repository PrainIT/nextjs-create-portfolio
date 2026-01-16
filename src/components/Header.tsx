"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

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
          <Link
            href="/portfolio-download"
            className={`text-brand text-base transition-opacity ${
              isActive("/portfolio-download")
                ? "opacity-100"
                : "opacity-100 hover:opacity-80"
            }`}
          >
            PORTFOLIO DOWNLOAD
          </Link>
        </div>
      </nav>
    </header>
  );
}
