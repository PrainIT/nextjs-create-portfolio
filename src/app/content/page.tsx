import { type SanityDocument } from "next-sanity";
import WorkPageClient from "@/components/WorkPageClient";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/utils";

const WORK_QUERY = `*[_type == "work"] | order(order asc, publishedAt desc) {
  _id,
  title,
  slug,
  image,
  tags,
  category,
  subCategory,
  description,
  publishedAt,
  order
}`;

const options = { next: { revalidate: 30 } };

// 디자인 콘텐츠, 사진 콘텐츠, AI 콘텐츠만 포함
const contentCategories = [
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

  // 디자인, 사진, AI 콘텐츠만 필터링
  const contentWorks = dummyWorks.filter(
    (work) =>
      work.category === "design" ||
      work.category === "photo" ||
      work.category === "ai"
  );

  const workProjects = contentWorks.map((work) => ({
    id: work._id,
    title: work.title,
    tags: work.tags || [],
    image: work.image ? urlForImage(work.image) : undefined,
    category: work.category,
    subCategory: work.subCategory,
    slug: work.slug?.current,
    description: work.description,
  }));

  return (
    <WorkPageClient
      workProjects={workProjects}
      workCategories={contentCategories}
      basePath="/content"
      pageTitle="전체 프로젝트"
    />
  );
}

