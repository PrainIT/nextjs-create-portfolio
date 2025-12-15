import HeroSection from "@/components/HeroSection";
import ContentSection from "@/components/ContentSection";
import LogoSlider from "@/components/LogoSlider";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/utils";
import { type SanityDocument } from "next-sanity";

const BRAND_QUERY = `*[_type == "brand"] | order(order asc, publishedAt desc) {
  _id,
  title,
  slug,
  brand,
  number,
  description,
  subDescription,
  thumbnailImage,
  filters,
  publishedAt,
  order
}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const brands = await client.fetch<SanityDocument[]>(BRAND_QUERY, {}, options);

  // 더미 데이터 생성 (Sanity에 데이터가 없을 경우)
  const dummyBrands: SanityDocument[] =
    brands.length > 0
      ? brands
      : [
          {
            _id: "dummy-brand-1",
            _rev: "dummy-rev-1",
            _type: "brand",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            title: "11번가 공식 인스타그램 운영",
            slug: { current: "11st-instagram" },
            description: "이러이러한걸 했고요 저러저러했습니다",
            subDescription: "굉장히 유익했고 보람찬 작업이었지요",
            number: "11",
            filters: ["릴스 Reels", "숏품 Short-form"],
            order: 1,
          },
          {
            _id: "dummy-brand-2",
            _rev: "dummy-rev-2",
            _type: "brand",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            title: "제스프리 코리아 DPR",
            slug: { current: "zespri-korea-dpr" },
            description: "이러이러한걸 했고요 지러지러했습니다",
            subDescription: "굉장히 유익했고 보람찬 작업이었지요",
            brand: "Zespri",
            filters: ["브랜디드 영상 Branded Film"],
            order: 2,
          },
          {
            _id: "dummy-brand-3",
            _rev: "dummy-rev-3",
            _type: "brand",
            _createdAt: new Date().toISOString(),
            _updatedAt: new Date().toISOString(),
            title: "롯데월드 공식 유튜브",
            slug: { current: "lotte-world-youtube" },
            description: "이러이러한걸 했고요 저러저러했습니다.",
            subDescription: "굉장히 유익했고 보람찬 작업이었지요",
            brand: "LOTTE WORLD",
            filters: ["예능 Entertainment", "브이로그 Vlog"],
            order: 3,
          },
        ];

  const contentCards = dummyBrands.map((brand) => ({
    id: brand._id,
    title: brand.title,
    description: brand.description || "",
    subDescription: brand.subDescription || "",
    number: brand.number,
    brand: brand.brand,
    image: brand.thumbnailImage ? urlForImage(brand.thumbnailImage) : undefined,
    slug: brand.slug?.current,
    filters: brand.filters || [],
  }));

  return (
    <main className="w-full">
      <HeroSection />
      <ContentSection contentCards={contentCards} />
      <LogoSlider />
    </main>
  );
}
