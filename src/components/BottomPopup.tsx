"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type HeightOption = {
  heightPixel?: number; // 정적인 높이 (px)
  heightVh?: number; // 뷰포트 높이 기준 퍼센트 (vh)
  wrapChildren?: boolean; // 자식 콘텐츠의 높이를 기준으로 자동 계산할지 여부
};

type BottomPopupProps = {
  isOpen: boolean; // 팝업 열림 여부
  onClose: () => void; // 팝업 닫기 콜백
  children?: React.ReactNode; // 팝업 내부에 들어갈 콘텐츠
  heightOption?: HeightOption; // 높이 옵션
};

const BottomPopup = ({
  isOpen,
  onClose,
  children,
  heightOption,
}: BottomPopupProps) => {
  const [isInDOM, setIsInDOM] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState<number>(
    typeof window !== "undefined" ? window.innerHeight / 2 : 400
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const bodyOverflowRef = useRef<string>("auto");
  const topRef = useRef<string>("0px");

  const { heightPixel: _heightPixel, heightVh: _heightVh, wrapChildren } = heightOption || {};

  // 오버레이 클릭 시 팝업 닫기
  const handleOverlayClick = useCallback(() => onClose(), [onClose]);

  // 콘텐츠 클릭 시 이벤트 전파 방지
  const handleContentClick = useCallback(
    (e: React.MouseEvent) => e.stopPropagation(),
    []
  );

  // 팝업 열림 상태 변화 감지
  useEffect(() => {
    if (!isOpen) {
      setIsInDOM(false);
      return;
    }

    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY;

    // body 스타일 백업
    bodyOverflowRef.current = document.body.style.overflow;
    topRef.current = document.body.style.top;

    // body 스크롤 막고 현재 위치 고정
    document.body.style.overflow = "hidden";
    document.body.style.top = `-${scrollY}px`;

    // DOM에 포함되도록 상태 설정
    setIsInDOM(true);
  }, [isOpen]);

  // DOM 렌더링 완료 후 높이 측정
  useEffect(() => {
    if (isInDOM) {
      if (wrapChildren && contentRef.current) {
        // 높이 측정 함수
        const measureHeight = () => {
          if (contentRef.current) {
            const h = contentRef.current.offsetHeight;
            if (h > 0) setMeasuredHeight(h);
          }
        };

        // 즉시 측정
        measureHeight();

        // iframe 등 비동기 콘텐츠 로드를 위해 약간의 지연 후 재측정
        const timeoutId = setTimeout(measureHeight, 100);
        const timeoutId2 = setTimeout(measureHeight, 500);

        // ResizeObserver로 크기 변경 감지
        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined' && contentRef.current) {
          resizeObserver = new ResizeObserver(() => {
            measureHeight();
          });
          resizeObserver.observe(contentRef.current);
        }

        return () => {
          clearTimeout(timeoutId);
          clearTimeout(timeoutId2);
          if (resizeObserver) {
            resizeObserver.disconnect();
          }
        };
      } else if (_heightVh) {
        // heightVh 옵션이 있으면 vh 단위로 계산
        const vhInPixels = (window.innerHeight * _heightVh) / 100;
        setMeasuredHeight(vhInPixels);
      } else if (_heightPixel) {
        // heightOption에 주어진 정적인 높이 사용
        setMeasuredHeight(_heightPixel);
      }
    } else {
      // 팝업이 DOM에서 제거될 때 body 스타일 복원
      const scrollY = document.body.style.top;
      document.body.style.overflow = bodyOverflowRef.current;
      document.body.style.top = topRef.current;

      // 스크롤 위치 복원
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
  }, [isInDOM, wrapChildren, _heightPixel, _heightVh]);

  // 컴포넌트 언마운트 시 body 스타일 복원
  useEffect(() => {
    return () => {
      document.body.style.overflow = bodyOverflowRef.current;
      document.body.style.top = topRef.current;
    };
  }, []);

  // 팝업이 열리지 않았고 wrapChildren이 아니라면 렌더링하지 않음
  if (!wrapChildren && !isInDOM) return null;

  return (
    <AnimatePresence>
      {isInDOM && (
        <>
          {/* 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-[999]"
            onClick={handleOverlayClick}
          />
          {/* 팝업 콘텐츠 */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${measuredHeight}px` }}
            exit={{ height: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.2)] z-[1000] overflow-y-auto scrollbar-hide pb-[env(safe-area-inset-bottom)]"
            style={{ 
              WebkitOverflowScrolling: "touch",
              maxHeight: _heightVh ? `${_heightVh}vh` : "90vh"
            }}
            onClick={handleContentClick}
          >
            <div ref={contentRef} className="relative">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomPopup;
