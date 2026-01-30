"use client";

import {
  useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FloatingDock, DockIcon } from "@/components/FloatingDock";

export interface BrandedProject {
  id: string;
  title: string;
  tags?: string[];
  image?: string;
  category?: string;
  subCategory?: string | string[];
  slug?: string;
  client?: string;
  publishedAt?: string;
}

interface BrandedPageClientProps {
  workProjects: BrandedProject[];
}

// 확대 시 아이콘 최대 크기(188px) 기준 좌우·상하 여유
const DOCK_EXPAND_MARGIN = 96; // 좌우: (188-106)/2 + 여유
const DOCK_VERTICAL_MARGIN = 52; // 상하: (188-96)/2 + 여유

export default function BrandedPageClient({
  workProjects,
}: BrandedPageClientProps) {
  const router = useRouter();
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    scrollLeft: 0,
    contentWidth: 0,
    viewportWidth: 0,
    trackWidth: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const hasCenteredInitial = useRef(false);

  const updateScrollState = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    const track = trackRef.current;
    if (!viewport || !content) return;
    const contentWidth = content.scrollWidth;
    const viewportWidth = viewport.clientWidth;
    const trackWidth = track?.offsetWidth ?? 0;
    const maxScroll = Math.max(0, contentWidth - viewportWidth);

    // setState 콜백 전에 한 번만 결정해 캡처 (여러 번 호출돼도 덮어쓰기 방지)
    const shouldCenter = maxScroll > 0 && !hasCenteredInitial.current;
    if (shouldCenter) hasCenteredInitial.current = true;

    setScrollState((prev) => {
      const next = {
        ...prev,
        contentWidth,
        viewportWidth,
        trackWidth: trackWidth || prev.trackWidth,
      };
      if (shouldCenter) {
        next.scrollLeft = maxScroll / 2;
      }
      return next;
    });
  }, []);

  // 스크롤이 있으면 처음부터 가운데이므로, DOM 직후에 초기 중앙 설정 (한 프레임도 왼쪽 안 보이게)
  useLayoutEffect(() => {
    updateScrollState();
  }, [updateScrollState, workProjects.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    const track = trackRef.current;
    const ro = new ResizeObserver(updateScrollState);
    if (viewport) ro.observe(viewport);
    if (content) ro.observe(content);
    if (track) ro.observe(track);
    return () => ro.disconnect();
  }, [updateScrollState, workProjects.length]);

  const maxScroll = Math.max(0, scrollState.contentWidth - scrollState.viewportWidth);

  // 스크롤이 필요할 때 아직 중앙 설정 전이면, 보여주는 값만 먼저 가운데로 (DockIcon·썸 둘 다 가운데)
  const scrollLeft = (() => {
    const raw = Math.max(0, Math.min(maxScroll, scrollState.scrollLeft));
    const needCenter =
      maxScroll > 0 &&
      scrollState.contentWidth > 0 &&
      scrollState.viewportWidth > 0 &&
      !hasCenteredInitial.current;
    return needCenter ? maxScroll / 2 : raw;
  })();
  const setScrollLeft = useCallback(
    (v: number) => setScrollState((prev) => ({ ...prev, scrollLeft: v })),
    []
  );

  const thumbWidth =
    maxScroll === 0
      ? scrollState.trackWidth
      : Math.min(
          60,
          Math.max(
            12,
            (scrollState.viewportWidth / scrollState.contentWidth) *
              scrollState.trackWidth
          )
        );
  const thumbMaxLeft = Math.max(0, scrollState.trackWidth - thumbWidth);
  const thumbLeft = maxScroll === 0 ? 0 : (scrollLeft / maxScroll) * thumbMaxLeft;

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).getAttribute("role") === "slider") return;
    const track = trackRef.current;
    if (!track || maxScroll <= 0) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setScrollLeft(ratio * maxScroll);
  };

  const handleThumbPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (maxScroll <= 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, scrollLeft };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => {
      const track = trackRef.current;
      const dx = e.clientX - dragStart.current.x;
      const moveRatio = track && thumbMaxLeft > 0 ? dx / thumbMaxLeft : 0;
      const newScroll = Math.max(0, Math.min(maxScroll, dragStart.current.scrollLeft + moveRatio * maxScroll));
      setScrollState((prev) => ({ ...prev, scrollLeft: newScroll }));
      dragStart.current = { x: e.clientX, scrollLeft: newScroll };
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [isDragging, maxScroll, thumbMaxLeft]);

  const handleProjectClick = (project: BrandedProject) => {
    if (project.slug) {
      router.push(`/branded/${project.slug}`);
    }
  };

  const showScrollUi = maxScroll > 0;

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaX !== 0) e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <main
      ref={mainRef}
      className="w-full relative flex flex-col pt-24"
      style={{ minHeight: "100vh" }}
    >
      {/* overflow-x-hidden + 100vw로 양옆 채우기: 뷰포트 전체 너비 블록이라 스크롤 안 생기고, 배경으로 양옆 채움 */}
      <div
        className="flex-1 flex flex-col items-center justify-center w-full gap-4 overflow-x-hidden bg-[#E3E3E3] dark:bg-[#1a1a1a]"
        style={{
          width: "100vw",
          maxWidth: "100vw",
          marginLeft: "calc(50% - 50vw)",
          paddingLeft: DOCK_EXPAND_MARGIN,
          paddingRight: DOCK_EXPAND_MARGIN,
          paddingTop: DOCK_VERTICAL_MARGIN,
          paddingBottom: DOCK_VERTICAL_MARGIN,
        }}
      >
        <div
          ref={viewportRef}
          // 스크롤이 있으면(justify-start) 왼쪽 기준, 없으면(justify-center) 중앙 정렬
          className={`w-full min-h-[220px] overflow-visible flex items-center ${
            showScrollUi ? "justify-start" : "justify-center"
          }`}
          style={{ overflow: "visible" }}
        >
          <div
            ref={contentRef}
            // [참고] flex-shrink-0은 필수입니다 
            className="flex-shrink-0 min-h-[200px] flex items-center justify-center transition-[transform] duration-150 ease-out"
            style={{
              transform: `translateX(${-scrollLeft}px)`,
            }}
          >
            <FloatingDock>
              {workProjects.map((project) => (
                <DockIcon
                  key={project.id}
                  // href={project.slug ? `/branded/${project.slug}` : "#"}
                  // onClick={() => handleProjectClick(project)}

                  // 클릭방지 임시코드
                  href="#"
                  onClick={() => {}}
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 p-2.5">
                      <span className="text-lg font-medium text-white truncate">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </DockIcon>
              ))}
            </FloatingDock>
          </div>
        </div>

        {showScrollUi && (
          <div
            ref={trackRef}
            role="scrollbar"
            aria-orientation="horizontal"
            aria-valuenow={scrollLeft}
            aria-valuemin={0}
            aria-valuemax={maxScroll}
            className="relative w-full mt-20 max-w-[min(100%,theme(spacing.96))] h-3 rounded-full bg-white dark:bg-gray-700/80 cursor-pointer touch-none select-none overflow-hidden"
            onClick={handleTrackClick}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-brand dark:bg-brand transition-colors hover:bg-brand/80 dark:hover:bg-brand/80 cursor-grab active:cursor-grabbing shrink-0"
              style={{
                width: thumbWidth,
                transform: `translateX(${thumbLeft}px)`,
              }}
              onPointerDown={handleThumbPointerDown}
              role="slider"
              tabIndex={0}
              onKeyDown={(e) => {
                const step = 40;
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  setScrollLeft(scrollLeft - step);
                } else if (e.key === "ArrowRight") {
                  e.preventDefault();
                  setScrollLeft(scrollLeft + step);
                }
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
