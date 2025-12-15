import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/utils";
import { PortableText } from "next-sanity";
import AboutPageClient from "./AboutPageClient";

const ABOUT_QUERY = `*[_type == "about"][0]`;

const options = { next: { revalidate: 30 } };

export default async function AboutPage() {
  const about = await client.fetch<SanityDocument>(ABOUT_QUERY, {}, options);

  // 더미 데이터 생성
  const dummyAbout: SanityDocument = {
    _id: "dummy-about",
    _rev: "dummy-rev",
    _type: "about",
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    title: about?.title || "WHY WORK WITH\nPRAIN GLOBAL'S CREATIVE\nDEPARTMENT",
    subtitle: about?.subtitle || "FULL CREATIVE EXECUTION - FROM A TO Z",
    description: about?.description || [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
          },
        ],
      },
    ],
    mainImage: about?.mainImage || null,
    projectHistory: about?.projectHistory || [
      {
        year: "2023",
        projects: [
          "Lorem ipsum dolor sit amet",
          "Consectetur adipiscing elit",
          "Sed do eiusmod tempor",
        ],
      },
      {
        year: "2024",
        projects: [
          "Ut enim ad minim veniam",
          "Quis nostrud exercitation",
          "Duis aute irure dolor",
        ],
      },
      {
        year: "2025",
        projects: ["Excepteur sint occaecat", "Sunt in culpa qui officia"],
      },
    ],
    awards: about?.awards || [
      "Lorem ipsum dolor sit amet consectetur adipiscing",
      "Sed do eiusmod tempor incididunt ut labore",
      "Ut enim ad minim veniam quis nostrud exercitation",
    ],
    downloadButtonText: about?.downloadButtonText || "회사소개서 다운로드",
    downloadFile: about?.downloadFile || null,
  };

  const mainImageUrl = dummyAbout.mainImage
    ? urlForImage(dummyAbout.mainImage)
    : null;

  return <AboutPageClient about={dummyAbout} mainImageUrl={mainImageUrl} />;
}
