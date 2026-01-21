import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/utils";
import WorkDetailClient from "@/components/WorkDetailClient";

const WORK_QUERY = `*[_type == "work" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  image,
  tags,
  category,
  subCategory,
  publishedAt,
  order,
  client,
  summary,
  award {
    title,
    description
  },
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

  // 템플릿 이미지 URL 변환
  const templatesWithImageUrls =
    work?.templates?.map((template: any) => ({
      ...template,
      images: template.images?.map((img: any) => urlForImage(img)) || [],
    })) || [];

  return (
    <WorkDetailClient
      work={{
        ...work,
        templates: templatesWithImageUrls,
      }}
      workImageUrl={workImageUrl}
      basePath="/branded"
    />
  );
}
