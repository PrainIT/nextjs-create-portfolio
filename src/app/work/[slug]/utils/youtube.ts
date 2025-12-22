/**
 * YouTube URL을 embed URL로 변환
 */
export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return "";

  // 이미 embed URL인 경우
  if (url.includes("youtube.com/embed/") || url.includes("youtu.be/embed/")) {
    return url;
  }

  // YouTube URL에서 video ID 추출
  let videoId = "";

  // 패턴 1: youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([^&\n?#]+)/);
  if (watchMatch && watchMatch[1]) {
    videoId = watchMatch[1];
  }

  // 패턴 2: youtu.be/VIDEO_ID
  if (!videoId) {
    const shortMatch = url.match(/youtu\.be\/([^?\n&#]+)/);
    if (shortMatch && shortMatch[1]) {
      videoId = shortMatch[1];
    }
  }

  // 패턴 3: youtube.com/embed/VIDEO_ID (이미 embed 형식)
  if (!videoId) {
    const embedMatch = url.match(/youtube\.com\/embed\/([^?\n&#]+)/);
    if (embedMatch && embedMatch[1]) {
      videoId = embedMatch[1];
    }
  }

  // 패턴 4: m.youtube.com/watch?v=VIDEO_ID
  if (!videoId) {
    const mobileMatch = url.match(/m\.youtube\.com\/watch\?v=([^&\n?#]+)/);
    if (mobileMatch && mobileMatch[1]) {
      videoId = mobileMatch[1];
    }
  }

  // 패턴 5: youtube.com/shorts/VIDEO_ID
  if (!videoId) {
    const shortsMatch = url.match(/youtube\.com\/shorts\/([^?\n&#]+)/);
    if (shortsMatch && shortsMatch[1]) {
      videoId = shortsMatch[1];
    }
  }

  // 패턴 6: m.youtube.com/shorts/VIDEO_ID
  if (!videoId) {
    const mobileShortsMatch = url.match(/m\.youtube\.com\/shorts\/([^?\n&#]+)/);
    if (mobileShortsMatch && mobileShortsMatch[1]) {
      videoId = mobileShortsMatch[1];
    }
  }

  // video ID를 찾았으면 embed URL 반환
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // video ID를 찾지 못한 경우 빈 문자열 반환 (에러 방지)
  console.warn("YouTube URL에서 video ID를 추출할 수 없습니다:", url);
  return "";
}


