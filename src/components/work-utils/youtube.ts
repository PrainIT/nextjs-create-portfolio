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

/**
 * YouTube URL에서 video ID 추출
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // 이미 embed URL인 경우
  if (url.includes("youtube.com/embed/") || url.includes("youtu.be/embed/")) {
    const embedMatch = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/embed\/)([^?\n&#]+)/);
    return embedMatch && embedMatch[1] ? embedMatch[1] : null;
  }

  // 패턴 1: youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([^&\n?#]+)/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // 패턴 2: youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?\n&#]+)/);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // 패턴 3: youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([^?\n&#]+)/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // 패턴 4: m.youtube.com/watch?v=VIDEO_ID
  const mobileMatch = url.match(/m\.youtube\.com\/watch\?v=([^&\n?#]+)/);
  if (mobileMatch && mobileMatch[1]) {
    return mobileMatch[1];
  }

  // 패턴 5: youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?\n&#]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  // 패턴 6: m.youtube.com/shorts/VIDEO_ID
  const mobileShortsMatch = url.match(/m\.youtube\.com\/shorts\/([^?\n&#]+)/);
  if (mobileShortsMatch && mobileShortsMatch[1]) {
    return mobileShortsMatch[1];
  }

  return null;
}

/**
 * YouTube video ID로부터 썸네일 URL 생성
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * YouTube URL이 Shorts인지 확인
 */
export function isYouTubeShorts(url: string): boolean {
  if (!url) return false;
  return url.includes("/shorts/") || url.includes("youtube.com/shorts/") || url.includes("m.youtube.com/shorts/");
}
