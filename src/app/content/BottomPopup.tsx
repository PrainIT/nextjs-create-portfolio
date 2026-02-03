"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type HeightOption = {
  heightPixel?: number;
  heightVh?: number;
  wrapChildren?: boolean;
};

type BottomPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  heightOption?: HeightOption;
};

const OVERLAY_DURATION = 0.25;
const PANEL_DURATION = 0.35;

export default function BottomPopup({
  isOpen,
  onClose,
  children,
  heightOption,
}: BottomPopupProps) {
  const [measuredHeight, setMeasuredHeight] = useState<number>(400);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    heightPixel: _heightPixel,
    heightVh: _heightVh,
    wrapChildren,
  } = heightOption || {};

  const handleOverlayClick = useCallback(() => onClose(), [onClose]);
  const handleContentClick = useCallback(
    (e: React.MouseEvent) => e.stopPropagation(),
    [],
  );

  const overlayRef = useRef<HTMLDivElement>(null);

  // 배경 스크롤만 막고, body 스타일은 건드리지 않음 (리플로우/리렌더 방지)
  const handleOverlayWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
  }, []);

  // 터치 스크롤은 passive: false로 막아야 iOS 등에서 확실히 동작
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !isOpen) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, [isOpen]);

  // 높이 계산 (isOpen일 때만 사용)
  useEffect(() => {
    if (!isOpen) return;

    if (wrapChildren && contentRef.current) {
      const measure = () => {
        if (contentRef.current && contentRef.current.offsetHeight > 0) {
          setMeasuredHeight(contentRef.current.offsetHeight);
        }
      };
      measure();
      const t1 = setTimeout(measure, 100);
      const t2 = setTimeout(measure, 500);
      let ro: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined" && contentRef.current) {
        ro = new ResizeObserver(measure);
        ro.observe(contentRef.current);
      }
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        ro?.disconnect();
      };
    }
    if (_heightVh) {
      setMeasuredHeight((window.innerHeight * _heightVh) / 100);
    } else if (_heightPixel) {
      setMeasuredHeight(_heightPixel);
    }
  }, [isOpen, wrapChildren, _heightPixel, _heightVh]);

  const measuredHeightPx = wrapChildren
    ? measuredHeight
    : _heightVh
      ? typeof window !== "undefined"
        ? (window.innerHeight * _heightVh) / 100
        : 400
      : (_heightPixel ?? 400);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="bottom-popup"
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: OVERLAY_DURATION }}
          className="fixed inset-0 z-[999] flex flex-col justify-end"
          aria-hidden={!isOpen}
        >
          {/* 오버레이: 클릭으로 닫기, 휠/터치로 배경 스크롤만 막음 (body 미변경) */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: OVERLAY_DURATION }}
            className="absolute inset-0 bg-black/50"
            onClick={handleOverlayClick}
            onWheel={handleOverlayWheel}
            style={{ touchAction: "none" }}
          />

          {/* 팝업 패널: 스크롤 가능, 스크롤바 UI만 숨김 / 아래에서 올라왔다 내려가는 애니메이션 */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: `${measuredHeightPx}px`,
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: PANEL_DURATION, ease: [0.32, 0.72, 0, 1] },
                opacity: { duration: OVERLAY_DURATION },
              },
            }}
            transition={{
              height: { type: "spring", damping: 32, stiffness: 320 },
              opacity: { duration: OVERLAY_DURATION },
            }}
            className="relative w-full max-w-[1440px] mx-auto bg-white rounded-t-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.2)] z-[1000] overflow-y-auto overflow-x-hidden scrollbar-hide pb-[env(safe-area-inset-bottom)]"
            style={{
              WebkitOverflowScrolling: "touch",
              maxHeight: _heightVh ? `${_heightVh}vh` : "90vh",
              // 스크롤은 되고, 스크롤바 UI만 숨김 (팝업 내부만 스크롤)
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onClick={handleContentClick}
          >
            <div ref={contentRef} className="relative">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
