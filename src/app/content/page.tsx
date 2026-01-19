import { type SanityDocument } from "next-sanity";
import WorkPageClient from "@/components/WorkPageClient";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/utils";
import {
  getYouTubeVideoId,
  getYouTubeThumbnailUrl,
} from "@/components/work-utils/youtube";

const WORK_QUERY = `*[_type == "work"] | order(order asc, publishedAt desc) {
  _id,
  title,
  slug,
  clientLogo,
  tags,
  category,
  subCategory,
  description,
  publishedAt,
  order,
  templates[] {
    templateType,
    category,
    subCategory,
    date,
    title,
    description,
    videoUrl,
    videoUrls,
    images[]
  }
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
  const works = await client.fetch<SanityDocument[]>(WORK_QUERY, {}, options);

  // 더미 데이터 생성
  const dummyWorks: SanityDocument[] =
    works.length > 0
      ? works
      : [
          {
            _id: "dummy-work-1",
            _rev: "dummy-rev-1",
            _type: "work",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            title: "Lorem Ipsum Dolor Sit Amet",
            slug: { current: "lorem-ipsum-1" },
            tags: ["0.5 Photo", "0.5 Video"],
            category: "design",
            subCategory: "sns-content",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            order: 1,
          },
          {
            _id: "dummy-work-3",
            _rev: "dummy-rev-3",
            _type: "work",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            title: "Sed Do Eiusmod Tempor",
            slug: { current: "lorem-ipsum-3" },
            tags: ["Photo", "Product"],
            category: "photo",
            subCategory: "product",
            description:
              "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
            order: 3,
          },
          {
            _id: "dummy-work-4",
            _rev: "dummy-rev-4",
            _type: "work",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            title: "Ut Enim Ad Minim Veniam",
            slug: { current: "lorem-ipsum-4" },
            tags: ["Design", "Branding"],
            category: "design",
            subCategory: "branding",
            description:
              "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
            order: 4,
          },
          {
            _id: "dummy-work-6",
            _rev: "dummy-rev-6",
            _type: "work",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            title: "Duis Aute Irure Dolor",
            slug: { current: "lorem-ipsum-6" },
            tags: ["Photo", "Portrait"],
            category: "photo",
            subCategory: "portrait",
            description:
              "Sunt in culpa qui officia deserunt mollit anim id est laborum.",
            order: 6,
          },
        ];

  // template 썸네일 URL 추출 함수 (영상 우선, 이미지 차순)
  const getTemplateThumbnailUrl = (
    template: any
  ): { image?: string; videoUrl?: string } => {
    // 1. videoUrl이 있으면 우선 사용 (템플릿 1, 2에서 사용)
    if (template.videoUrl) {
      const videoId = getYouTubeVideoId(template.videoUrl);
      if (videoId) {
        return {
          image: getYouTubeThumbnailUrl(videoId),
          videoUrl: template.videoUrl,
        };
      }
      // videoUrl이 있지만 videoId 추출 실패 시에도 videoUrl 반환 (나중에 처리 가능)
      return {
        videoUrl: template.videoUrl,
      };
    }
    
    // 2. videoUrls 배열의 첫 번째 항목 확인 (템플릿 1, 2에서 사용)
    if (template.videoUrls && template.videoUrls.length > 0) {
      const firstVideoUrl = template.videoUrls[0];
      const videoId = getYouTubeVideoId(firstVideoUrl);
      if (videoId) {
        return {
          image: getYouTubeThumbnailUrl(videoId),
          videoUrl: firstVideoUrl,
        };
      }
      // videoUrl이 있지만 videoId 추출 실패 시에도 videoUrl 반환
      return {
        videoUrl: firstVideoUrl,
      };
    }
    
    // 3. images 배열의 첫 번째 항목 확인 (템플릿 3, 4 또는 영상이 없을 때 fallback)
    if (template.images && template.images.length > 0) {
      return {
        image: urlForImage(template.images[0]),
      };
    }

    return {};
  };

  // 모든 콘텐츠 포함 - templates를 개별 카드로 펼치기
  const workProjects = dummyWorks.flatMap((work) => {
    // templates가 없거나 빈 배열이면 빈 배열 반환 (카드 표시 안 함)
    if (!work.templates || work.templates.length === 0) {
      return [];
    }

    // 각 template을 개별 카드로 변환
    return work.templates.map((template: any, templateIndex: number) => {
      const thumbnail = getTemplateThumbnailUrl(template);
      // 템플릿의 images 배열을 URL로 변환 (템플릿 3, 4용)
      const templateImages = template.images
        ? template.images.map((img: any) => urlForImage(img))
        : [];
      
      return {
        id: `${work._id}-template-${templateIndex}`,
        title: template.title || work.title,
        tags: work.tags || [],
        image: thumbnail.image,
        videoUrl: thumbnail.videoUrl,
        category: template.category || work.category,
        subCategory: template.subCategory || work.subCategory,
        slug: work.slug?.current,
        description: template.description || work.description,
        templates: [template], // 단일 template을 배열로 유지 (팝업에서 사용 가능)
        templateType: template.templateType, // 템플릿 타입 추가
        templateImages: templateImages, // 이미지 URL 배열 추가
        workTitle: work.title, // 원본 work title도 보관
        templateDate: template.date,
      };
    });
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
