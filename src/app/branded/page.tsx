import { type SanityDocument } from "next-sanity";
import WorkPageClient from "@/components/WorkPageClient";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/utils";

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
  client,
  videoUrl,
  videoUrls
}`;

const options = { next: { revalidate: 30 } };

// 모든 콘텐츠 포함
const brandedCategories = [
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

export default async function BrandedPage() {
  const works = await client.fetch<SanityDocument[]>(WORK_QUERY, {}, options);

  // 더미 데이터 생성
  const dummyWorks: SanityDocument[] =
    works.length > 0
      ? works
      : [
          {
            _id: "dummy-work-2",
            _rev: "dummy-rev-2",
            _type: "work",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            title: "Consectetur Adipiscing Elit",
            slug: { current: "lorem-ipsum-2" },
            tags: ["Video", "Motion Graphics"],
            category: "video",
            subCategory: "branded-video",
            description:
              "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            order: 2,
          },
          {
            _id: "dummy-work-5",
            _rev: "dummy-rev-5",
            _type: "work",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            title: "Quis Nostrud Exercitation",
            slug: { current: "lorem-ipsum-5" },
            tags: ["Video", "Short Form"],
            category: "video",
            subCategory: "short-form",
            description: "Excepteur sint occaecat cupidatat non proident.",
            order: 5,
          },
        ];

  // 모든 콘텐츠 포함 (필터링 제거)
  const workProjects = dummyWorks.map((work) => ({
    id: work._id,
    title: work.title,
    tags: work.tags || [],
    image: work.clientLogo ? urlForImage(work.clientLogo) : undefined,
    category: work.category,
    subCategory: work.subCategory,
    slug: work.slug?.current,
    description: work.description,
    client: work.client,
    publishedAt: work.publishedAt,
    videoUrl: work.videoUrl,
    videoUrls: work.videoUrls,
  }));

  return (
    <WorkPageClient
      workProjects={workProjects}
      workCategories={brandedCategories}
      basePath="/branded"
      pageTitle="전체 프로젝트"
    />
  );
}
