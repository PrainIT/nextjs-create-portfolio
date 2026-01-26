"use client";

interface RelatedVideo {
  id: string;
  title: string;
  thumbnail?: string;
  date?: string;
  slug?: string;
  onClick?: () => void;
}

interface RelationContentCardProps {
  videos: RelatedVideo[];
  title?: string;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export default function RelationContentCard({
  videos,
  title = "관련 영상을 더 찾으셨나요?",
}: RelationContentCardProps) {
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-brand py-8 px-8">
      {/* 제목 */}
      <h3 className="text-white text-xl font-bold mb-6">{title}</h3>

      {/* 비디오 카드 가로 스크롤 */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6" style={{ minWidth: "fit-content" }}>
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={video.onClick}
              className="flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ width: "280px" }}
            >
              {/* 비디오 썸네일 */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mb-3">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-grey-800" />
                )}
              </div>



              {/* 날짜 */}
              {video.date && (
                <p className="text-white text-xs text-center text-grey-300">
                  {formatDate(video.date)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
