/**
 * YouTube URL을 embed URL로 변환
 */
export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return "";

  // 이미 embed URL인 경우
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  // YouTube URL에서 video ID 추출
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // URL이 이미 올바른 형식이 아닌 경우 원본 반환
  return url;
}

