"use client";

interface ContentCardProps {
  id: number;
  title: string;
  image?: string;
  videoUrl?: string; // YouTube URL (영상 표시용)
  logo?: React.ReactNode;
  isSearchMode?: boolean;
  forceSquare?: boolean; // branded에서 무조건 정사각형으로 표시
  forceFullHeight?: boolean; // content에서 무조건 h-full로 표시
  disableVideoInteraction?: boolean; // 유튜브 재생 버튼 숨김 및 클릭 방지
  contentType?: number; // 1: 유튜브, 2: 숏폼
}

export default function ContentCard({
  id,
  title,
  image,
  videoUrl,
  logo,
  isSearchMode = false,
  forceSquare = false,
  forceFullHeight = false,
  disableVideoInteraction = false,
  contentType,
}: ContentCardProps) {

  return (
    <div className="overflow-hidden flex flex-col">
      {/* 이미지/로고 영역 */}
      <div
        className={`relative w-full bg-gradient-to-br from-grey-700 to-grey-900 rounded-2xl overflow-hidden ${
          !image && !videoUrl
            ? "aspect-square"
            : forceSquare || (!isSearchMode && !forceFullHeight)
              ? "aspect-square"
              : ""
        }`}
        style={
          !forceSquare &&
          !forceFullHeight &&
          isSearchMode &&
          !image &&
          !videoUrl
            ? {
                minHeight: "200px",
                height: `${200 + (id % 3) * 100}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }
            : contentType === 1 && image
            ? {
                aspectRatio: '16 / 9'
              }
            : contentType === 2 && image
            ? {
                aspectRatio: '9 / 16'
              }
            : {}
        }
      >
        {image ? (
          // 썸네일 이미지가 있으면 이미지 표시 (Content 1, 2용)
          <img
            src={image}
            alt={title}
            className={`w-full ${
              forceSquare || (!isSearchMode && !forceFullHeight)
                ? "aspect-square h-full"
                : contentType === 1 || contentType === 2
                ? "h-full"
                : "h-auto"
            } object-cover rounded-2xl pointer-events-none`}
          />
        ) : (
          // 썸네일 이미지가 없으면 빈 사각형 표시 (Content 1, 2에서 영상은 표시하지 않음)
          <div className={`w-full h-full ${
            contentType === 1 
              ? "aspect-video" 
              : contentType === 2 
              ? "aspect-[9/16]" 
              : ""
          } bg-grey-800 pointer-events-none`} />
        )}
        {logo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {logo}
          </div>
        )}
      </div>

      {/* 타이틀 */}
      {/* <div className="p-4"> */}
        {/* <h3 className="text-white text-left font-medium break-words">
          {title}
        </h3> */}
      {/* </div> */}
    </div>
  );
}
