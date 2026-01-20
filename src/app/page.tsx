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
  description,
  subDescription,
  thumbnailImage,
  filters,
  publishedAt,
  order
}`;

const FLOAT_TEXT_QUERY = `*[_type == "floatText"] | order(order asc) {
  _id,
  floatText,
  slug,
  highlighted,
  order
}`;

const CLIENT_QUERY = `*[_type == "client"] | order(order asc) {
  _id,
  name,
  logo,
  order
}`;

const WORK_QUERY = `*[_type == "work"] {
  _id,
  title,
  slug,
  client
}`;

const SOCIAL_LINK_QUERY = `*[_type == "socialLink"] | order(order asc) {
  _id,
  name,
  logo,
  url,
  order
}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const brands = await client.fetch<SanityDocument[]>(BRAND_QUERY, {}, options);
  const floatTexts = await client.fetch<SanityDocument[]>(
    FLOAT_TEXT_QUERY,
    {},
    options
  );
  const clients = await client.fetch<SanityDocument[]>(
    CLIENT_QUERY,
    {},
    options
  );
  const works = await client.fetch<SanityDocument[]>(WORK_QUERY, {}, options);
  const socialLinks = await client.fetch<SanityDocument[]>(
    SOCIAL_LINK_QUERY,
    {},
    options
  );

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
            filters: ["예능 Entertainment", "브이로그 Vlog"],
            order: 3,
          },
        ];

  const contentCards = dummyBrands.map((brand) => ({
    id: brand._id,
    title: brand.title,
    description: brand.description || "",
    subDescription: brand.subDescription || "",
    image: brand.thumbnailImage ? urlForImage(brand.thumbnailImage) : undefined,
    slug: brand.slug?.current,
    filters: brand.filters || [],
  }));

  // 클라이언트와 work를 매칭하여 slug 찾기
  const getWorkSlugForClient = (clientName: string): string | null => {
    const matchingWork = works.find(
      (work) => work.client && work.client.toLowerCase() === clientName.toLowerCase()
    );
    return matchingWork?.slug?.current || null;
  };

  // 클라이언트 데이터에서 5개 무작위 선별
  const getRandomClients = (count: number = 5) => {
    if (clients.length === 0) return [];
    
    // 배열 복사 후 셔플
    const shuffled = [...clients].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, clients.length));
  };

  // floatText 데이터를 HeroSection 형식으로 변환
  // 높이는 랜덤하게 생성 (10vh ~ 90vh 사이)
  const generateRandomTop = (index: number, total: number) => {
    // 각 항목이 고르게 분산되도록 하되 약간의 랜덤성 추가
    const basePosition = 10 + (index / total) * 80; // 10vh ~ 90vh 사이 고르게 분산
    const randomOffset = (Math.random() - 0.5) * 15; // ±7.5vh 랜덤 오프셋
    return `${Math.max(5, Math.min(95, basePosition + randomOffset))}vh`;
  };

  // 클라이언트에서 5개 무작위 선별하여 companies 생성
  const selectedClients = getRandomClients(5);
  const companies =
    selectedClients.length > 0
      ? selectedClients.map((client, index) => {
          const workSlug = getWorkSlugForClient(client.name);
          return {
            name: client.name || "",
            highlighted: false,
            top: generateRandomTop(index, selectedClients.length),
            slug: workSlug ? `/branded/${workSlug}` : "",
          };
        })
      : floatTexts.length > 0
      ? floatTexts.map((item, index) => ({
          name: item.floatText || "",
          highlighted: item.highlighted || false,
          top: generateRandomTop(index, floatTexts.length),
          slug: item.slug?.current || "",
        }))
      : [
          {
            name: "ZESPRI",
            highlighted: false,
            top: generateRandomTop(0, 5),
            slug: "",
          },
          {
            name: "YUHAN-KIMBERLY",
            highlighted: false,
            top: generateRandomTop(1, 5),
            slug: "",
          },
          {
            name: "ASTRAZENECA",
            highlighted: false,
            top: generateRandomTop(2, 5),
            slug: "",
          },
          {
            name: "POSCO FUTURE",
            highlighted: false,
            top: generateRandomTop(3, 5),
            slug: "",
          },
          {
            name: "JIMMY JOHN'S",
            highlighted: true,
            top: generateRandomTop(4, 5),
            slug: "",
          },
        ];

  // 고객사 데이터 변환
  const clientLogos =
    clients.length > 0
      ? clients.map((client) => ({
          name: client.name || "",
          logo: client.logo ? urlForImage(client.logo) : undefined,
        }))
      : [];

  // 소셜 링크 데이터 변환
  const socialLinkData = socialLinks.map((link) => ({
    name: link.name || "",
    logo: link.logo ? urlForImage(link.logo) : undefined,
    url: link.url || "",
  }));

  return (
    <main className="w-full">
      <HeroSection companies={companies} />
      <ContentSection contentCards={contentCards} />
      <LogoSlider logos={clientLogos} socialLinks={socialLinkData} />
    </main>
  );
}
