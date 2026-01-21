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
  publishedAt,
  order,
  client
}`;

const options = { next: { revalidate: 30 } };

// Industry 카테고리
const brandedCategories = [
  {
    title: "Industry",
    items: [
      { label: "금융", value: "finance" },
      { label: "기업PR/정부·공공기관", value: "corporate-pr-government" },
      { label: "IT·정보통신/서비스", value: "it-communication-service" },
      { label: "패션·뷰티/생활용품", value: "fashion-beauty-household" },
      { label: "가전/전자", value: "appliance-electronics" },
      { label: "식음료/제약", value: "food-beverage-pharmaceutical" },
      { label: "자동차/건설", value: "automotive-construction" },
      { label: "유통/기타", value: "distribution-other" },
    ],
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
    client: work.client,
    publishedAt: work.publishedAt,
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
