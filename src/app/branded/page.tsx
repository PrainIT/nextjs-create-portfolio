import { type SanityDocument } from "next-sanity";
import BrandedPageClient from "@/app/branded/BrandedPageClient";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/utils";

const WORK_QUERY = `*[_type == "branded"] | order(order asc, publishedAt desc) {
  _id,
  title,
  slug,
  clientLogo,
  tags,
  category,
  subCategory,
  publishedAt,
  order,
  "client": clientRef->name,
  "clientRefLogo": clientRef->logo
}`;

const options = { next: { revalidate: 30 } };

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
            _type: "branded",
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
            _type: "branded",
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
  const workProjects = dummyWorks.map((work) => {
    // clientLogo 우선, 없으면 clientRef 로고 사용
    const logoImage = work.clientLogo || work.clientRefLogo;
    return {
      id: work._id,
      title: work.title,
      tags: work.tags || [],
      image: logoImage ? urlForImage(logoImage) : undefined,
      category: work.category,
      subCategory: work.subCategory,
      slug: work.slug?.current,
      client: work.client,
      publishedAt: work.publishedAt,
    };
  });

  return <BrandedPageClient workProjects={workProjects} />;
}
