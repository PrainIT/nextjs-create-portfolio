import { type SanityDocument } from "next-sanity";
import WorkPageClient from "@/components/WorkPageClient";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/utils";

const CONTENT_QUERY = `*[_type == "content"] | order(date desc, _createdAt desc) {
  _id,
  contentType,
  category,
  subCategory,
  date,
  title,
  descriptionBranded,
  descriptionContent,
  tags,
  videoUrl,
  videoUrls,
  thumbnailImage,
  images[],
  "client": clientRef->name,
  "clientLogo": clientRef->logo
}`;

const options = { next: { revalidate: 30 } };

// 모든 콘텐츠 포함
const contentCategories = [
  {
    title: "영상 콘텐츠",
    items: [
      { label: "브랜디드 영상", value: "branded-video" },
      { label: "캠페인 영상", value: "campaign-video" },
      { label: "숏폼", value: "short-form" },
      { label: "웹예능", value: "web-entertainment" },
      { label: "스케치 영상", value: "sketch-video" },
      { label: "드라마", value: "drama" },
      { label: "인터뷰 영상", value: "interview-video" },
      { label: "모션그래픽", value: "motion-graphics" },
      { label: "뮤직비디오", value: "music-video" },
      { label: "LIVE", value: "live" },
    ],
  },
  {
    title: "디자인 콘텐츠",
    items: [
      { label: "SNS 콘텐츠", value: "sns-content" },
      { label: "브랜딩", value: "branding" },
      { label: "인포그래픽", value: "infographic" },
      { label: "포스터", value: "poster" },
      { label: "배너", value: "banner" },
      { label: "카드뉴스", value: "card-news" },
      { label: "키비주얼", value: "key-visual" },
      { label: "인쇄물", value: "print" },
      { label: "상세페이지", value: "detail-page" },
      { label: "패키지", value: "package" },
    ],
  },
  {
    title: "사진 콘텐츠",
    items: [
      { label: "제품", value: "product" },
      { label: "인물", value: "portrait" },
      { label: "스케치", value: "sketch" },
    ],
  },
  {
    title: "AI 콘텐츠",
    items: [],
  },
] as const;

export default async function ContentPage() {
  const contents = await client.fetch<SanityDocument[]>(CONTENT_QUERY, {}, options);

  // 콘텐츠 썸네일 URL 추출 함수
  const getContentThumbnailUrl = (
    content: any
  ): { image?: string; videoUrl?: string } => {
    // 1. thumbnailImage가 있으면 이미지 반환 (카드에 표시)
    // videoUrl도 함께 반환하여 BottomPopup에서 사용할 수 있도록 함
    if (content.thumbnailImage) {
      return {
        image: urlForImage(content.thumbnailImage),
        videoUrl: content.videoUrl || (content.videoUrls && content.videoUrls.length > 0 ? content.videoUrls[0] : undefined),
      };
    }
    
    // 2. Content 1, 2에서 썸네일 이미지가 없는 경우
    // 카드에는 빈 사각형 표시 (이미지 URL 반환하지 않음)
    // videoUrl은 BottomPopup용으로 반환
    if (content.contentType === 1 || content.contentType === 2) {
      if (content.videoUrl) {
        return {
          videoUrl: content.videoUrl,
        };
      }
      if (content.videoUrls && content.videoUrls.length > 0) {
        return {
          videoUrl: content.videoUrls[0],
        };
      }
    }
    
    // 4. images 배열의 첫 번째 항목 확인 (콘텐츠 3, 4 또는 영상이 없을 때 fallback)
    if (content.images && content.images.length > 0) {
      return {
        image: urlForImage(content.images[0]),
      };
    }

    return {};
  };

  // 각 content를 개별 카드로 변환
  const workProjects = contents.map((content: any) => {
    const thumbnail = getContentThumbnailUrl(content);
    // 콘텐츠의 images 배열을 URL로 변환 (콘텐츠 3, 4용)
    const contentImages = content.images
      ? content.images.map((img: any) => urlForImage(img))
      : [];
    
    return {
      id: content._id,
      title: content.title || '제목 없음',
      tags: content.tags || [], // Content 팝업에서 표시될 태그들
      image: thumbnail.image,
      // videoUrl은 썸네일 함수에서 가져오되, 없으면 content에서 직접 가져오기 (Content 1용)
      videoUrl: thumbnail.videoUrl || content.videoUrl,
      videoUrls: content.videoUrls || [],
      category: content.category,
      subCategory: content.subCategory,
      slug: undefined, // content는 slug가 없음
      description: content.descriptionContent, // Content 팝업용 설명
      descriptionBranded: content.descriptionBranded, // Branded 상세용 설명
      client: content.client, // 클라이언트 이름
      contents: [content], // 단일 content를 배열로 유지 (팝업에서 사용 가능)
      contentType: content.contentType,
      contentImages: contentImages,
      contentDate: content.date,
      hasThumbnailImage: !!content.thumbnailImage, // 썸네일 이미지 여부
    };
  });

  return (
    <WorkPageClient
      workProjects={workProjects}
      workCategories={contentCategories}
      basePath="/content"
      pageTitle="전체 프로젝트"
    />
  );
}
