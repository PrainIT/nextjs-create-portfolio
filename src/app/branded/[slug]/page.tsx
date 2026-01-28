import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/utils";
import BrandedDetailClient from "@/app/branded/BrandedDetailClient";

const WORK_QUERY = `*[_type == "branded" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  image,
  clientLogo,
  tags,
  category,
  subCategory,
  publishedAt,
  order,
  "client": clientRef->name,
  "clientRefLogo": clientRef->logo,
  summary,
  award {
    title,
    description
  },
  contents[] {
    content2Role,
    "content": contentRef-> {
      _id,
      contentType,
      category,
      subCategory,
      date,
      title,
      "description": descriptionBranded,
      videoUrl,
      videoUrls,
      images[],
      "client": clientRef->name
    },
    "attachToContent": attachToContentRef-> {
      _id,
      contentType,
      title
    }
  }
}`;

// 관련 branded 항목 쿼리 (같은 category와 subCategory)
const RELATED_WORKS_QUERY = `*[_type == "branded" && category == $category && subCategory == $subCategory && slug.current != $slug] | order(order asc, publishedAt desc) {
  _id,
  title,
  slug,
  category,
  subCategory,
  publishedAt,
  dashboardImage,
  "client": clientRef->name,
  "clientRefLogo": clientRef->logo,
  clientLogo
}`;

const options = { next: { revalidate: 30 } };

export default async function BrandedDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await client.fetch<SanityDocument>(
    WORK_QUERY,
    { slug },
    options
  );

  if (!work) {
    return (
      <main className="container mx-auto min-h-screen max-w-7xl p-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">작품을 찾을 수 없습니다</h1>
        <p className="text-grey-400">요청하신 작품이 존재하지 않습니다.</p>
      </main>
    );
  }

  const workImageUrl = work?.image ? urlForImage(work.image) : null;
  
  // clientLogo 우선, 없으면 clientRef 로고 사용
  const clientLogoUrl = work?.clientLogo 
    ? urlForImage(work.clientLogo) 
    : work?.clientRefLogo 
      ? urlForImage(work.clientRefLogo) 
      : null;

  // 콘텐츠 이미지 URL 변환 및 구조 변환
  const contentsWithImageUrls =
    work?.contents?.map((item: any) => {
      if (!item.content) return null;
      
      const content = {
        ...item.content,
        images: item.content.images?.map((img: any) => urlForImage(img)) || [],
        // Content2 역할 정보 추가
        content2Role: item.content2Role || null,
        attachToContentId: item.attachToContent?._id || null,
      };
      
      return content;
    }).filter(Boolean) || [];

  // 관련 branded 항목 가져오기 (같은 category와 subCategory)
  const relatedWorks = work?.category && work?.subCategory
    ? await client.fetch<SanityDocument[]>(
        RELATED_WORKS_QUERY,
        {
          category: work.category,
          subCategory: work.subCategory,
          slug: slug,
        },
        options
      )
    : [];

  // 관련 영상 데이터 변환
  const relatedVideos = relatedWorks.map((relatedWork: any) => {
    const logoImage = relatedWork.clientLogo || relatedWork.clientRefLogo;
    return {
      id: relatedWork._id,
      title: relatedWork.title,
      thumbnail: relatedWork.dashboardImage
        ? urlForImage(relatedWork.dashboardImage)
        : logoImage
        ? urlForImage(logoImage)
        : undefined,
      date: relatedWork.publishedAt,
      slug: relatedWork.slug?.current,
    };
  });

  return (
    <BrandedDetailClient
      work={{
        ...work,
        clientLogoUrl,
        contents: contentsWithImageUrls,
      }}
      workImageUrl={workImageUrl}
      relatedVideos={relatedVideos}
    />
  );
}
