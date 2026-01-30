import HeroSection from "@/components/HeroSection";
import ContentSection from "@/components/ContentSection";
import LogoSlider from "@/components/LogoSlider";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/utils";
import { type SanityDocument } from "next-sanity";

const CLIENT_QUERY = `*[_type == "client"] | order(order asc) {
  _id,
  name,
  logo,
  order
}`;

const WORK_QUERY = `*[_type == "branded"] {
  _id,
  title,
  slug,
  "client": clientRef->name
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

  // 높이는 랜덤하게 생성 (10vh ~ 90vh 사이)
  const generateRandomTop = (index: number, total: number) => {
    // 각 항목이 고르게 분산되도록 하되 약간의 랜덤성 추가
    const basePosition = 10 + (index / total) * 80; // 10vh ~ 90vh 사이 고르게 분산
    const randomOffset = (Math.random() - 0.5) * 15; // ±7.5vh 랜덤 오프셋
    return `${Math.max(5, Math.min(95, basePosition + randomOffset))}vh`;
  };

  // 클라이언트에서 5개 무작위 선별하여 companies 생성
  

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
      <HeroSection />
      <ContentSection />
      <LogoSlider logos={clientLogos} socialLinks={socialLinkData} />
    </main>
  );
}
