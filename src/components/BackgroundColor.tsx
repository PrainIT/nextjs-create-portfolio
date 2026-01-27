"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function BackgroundColor() {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    
    // '/' 또는 '/about' 페이지인 경우 FF6B00 배경색 적용
    if (pathname === "/" || pathname === "/about") {
      body.style.backgroundColor = "#FF6B00";
    } else if (pathname === "/branded") {
      body.style.backgroundColor = "#E3E3E3";
    } else {
      body.style.backgroundColor = "white";
    }

    return () => {
      // cleanup은 필요 없지만 명시적으로 작성
    };
  }, [pathname]);

  return null;
}
