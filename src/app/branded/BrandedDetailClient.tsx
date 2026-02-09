"use client";

import { type SanityDocument } from "next-sanity";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import ScrollSectionNav, { useScrollSectionNav } from "@/components/ScrollSectionNav";
import Template1 from "@/components/work-templates/Template1";
import Template2 from "@/components/work-templates/Template2";
import Template3 from "@/components/work-templates/Template3";
import Template4 from "@/components/work-templates/Template4";
import RelationContentCard from "@/components/RelationContentCard";
import FullWidthImageBlock from "@/components/branded/FullWidthImageBlock";
import ImageSliderBlock from "@/components/branded/ImageSliderBlock";
import type { SanityImageSource } from "@sanity/image-url";
import { urlForImage } from "@/sanity/utils";

interface Content {
  _id?: string;
  contentType: number;
  category?: string;
  subCategory?: string;
  date?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  videoUrls?: string[];
  images?: string[];
  content2Role?: 'base' | 'attach' | null;
  attachToContentId?: string | null;
}

interface RelatedVideo {
  id: string;
  title: string;
  thumbnail?: string;
  date?: string;
  slug?: string;
  onClick?: () => void;
}

interface BrandedDetailClientProps {
  work: SanityDocument & {
    displayType?: "type1" | "type2";
    heroImage?: { asset?: { _ref?: string } };
    subtitle?: string;
    body?: PortableTextBlock[];
    client?: string;
    summary?: string;
    clientLogoUrl?: string | null;
    award?: {
      title?: string;
      description?: string;
    };
    contents?: Content[];
  };
  workImageUrl: string | null;
  heroImageUrl?: string | null;
  relatedVideos?: RelatedVideo[];
}

const BASE_PATH = "/branded";

/** Type2 본문 블록 커스텀 렌더링 (내용·사진·영상·사진3장 순서 자유) */
function getBodyPortableTextComponents() {
  return {
    types: {
      brandedBodyImage: ({
        value,
      }: {
        value: { image?: { asset?: { _ref?: string } }; caption?: string };
      }) => {
        if (!value?.image) return null;
        const src = urlForImage(value.image);
        return (
          <figure className="my-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={value.caption || ""}
              className="w-full rounded-lg object-contain max-h-[70vh]"
            />
            {value.caption && (
              <figcaption className="mt-2 text-center text-sm text-gray-400">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      brandedBodyVideo: ({
        value,
      }: {
        value: { url?: string; caption?: string };
      }) => {
        if (!value?.url) return null;
        const url = value.url.trim();
        const isYoutube =
          /youtube\.com\/watch\?v=|youtu\.be\//.test(url) ||
          /youtube\.com\/embed\//.test(url);
        const isVimeo = /vimeo\.com\//.test(url);
        let embedSrc: string | null = null;
        if (isYoutube) {
          const m = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:&|$)/);
          embedSrc = m ? `https://www.youtube.com/embed/${m[1]}` : null;
        } else if (isVimeo) {
          const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
          embedSrc = m ? `https://player.vimeo.com/video/${m[1]}` : null;
        }
        return (
          <figure className="my-8">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              {embedSrc ? (
                <iframe
                  src={embedSrc}
                  title="영상"
                  className="h-full w-full"
                  allowFullScreen
                />
              ) : (
                <video
                  src={url}
                  controls
                  className="h-full w-full"
                  playsInline
                />
              )}
            </div>
            {value.caption && (
              <figcaption className="mt-2 text-center text-sm text-gray-400">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      brandedBodyImageRow: ({
        value,
      }: {
        value: {
          images?: Array<{ image?: { asset?: unknown }; caption?: string }>;
        };
      }) => {
        const images = value?.images?.filter((i) => i?.image) ?? [];
        if (images.length === 0) return null;
        return (
          <figure className="my-8 grid grid-cols-3 gap-2 md:gap-4">
            {images.map((item, idx) => {
              const src = urlForImage(item.image!);
              return (
                <div key={idx} className="overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={item.caption || ""}
                    className="h-full w-full object-cover"
                  />
                  {item.caption && (
                    <figcaption className="mt-1 text-center text-xs text-gray-400">
                      {item.caption}
                    </figcaption>
                  )}
                </div>
              );
            })}
          </figure>
        );
      },
      brandedBodyImageRow2: ({
        value,
      }: {
        value: {
          images?: Array<{ image?: { asset?: unknown }; caption?: string }>;
        };
      }) => {
        const images = value?.images?.filter((i) => i?.image) ?? [];
        if (images.length < 2) return null;
        return (
          <figure className="my-8 grid grid-cols-2 gap-2 md:gap-4">
            {images.slice(0, 2).map((item, idx) => {
              const src = urlForImage(item.image!);
              return (
                <div key={idx} className="overflow-hidden rounded-lg aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={item.caption || ""}
                    className="h-full w-full object-cover"
                  />
                  {item.caption && (
                    <figcaption className="mt-1 text-center text-xs text-gray-400">
                      {item.caption}
                    </figcaption>
                  )}
                </div>
              );
            })}
          </figure>
        );
      },
      brandedBodyImageGrid2x2: ({
        value,
      }: {
        value: {
          images?: Array<{ image?: { asset?: unknown }; caption?: string }>;
        };
      }) => {
        const images = value?.images?.filter((i) => i?.image) ?? [];
        if (images.length < 4) return null;
        return (
          <figure className="my-8 grid grid-cols-2 gap-2 md:gap-4">
            {images.slice(0, 4).map((item, idx) => {
              const src = urlForImage(item.image!);
              return (
                <div key={idx} className="overflow-hidden rounded-lg aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={item.caption || ""}
                    className="h-full w-full object-cover"
                  />
                  {item.caption && (
                    <figcaption className="mt-1 text-center text-xs text-gray-400">
                      {item.caption}
                    </figcaption>
                  )}
                </div>
              );
            })}
          </figure>
        );
      },
      brandedBodyImageGrid3x2: ({
        value,
      }: {
        value: {
          images?: Array<{ image?: { asset?: unknown }; caption?: string }>;
        };
      }) => {
        const images = value?.images?.filter((i) => i?.image) ?? [];
        if (images.length < 6) return null;
        return (
          <figure className="my-8 grid grid-cols-3 gap-2 md:gap-4 p-4 md:p-8 bg-black rounded-lg">
            {images.slice(0, 6).map((item, idx) => {
              const src = urlForImage(item.image!);
              return (
                <div key={idx} className="overflow-hidden rounded-lg aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={item.caption || ""}
                    className="h-full w-full object-cover"
                  />
                  {item.caption && (
                    <figcaption className="mt-1 text-center text-xs text-gray-400">
                      {item.caption}
                    </figcaption>
                  )}
                </div>
              );
            })}
          </figure>
        );
      },
      brandedBodyFullWidthImage: ({
        value,
      }: {
        value: { image?: { asset?: unknown }; caption?: string };
      }) => {
        if (!value?.image) return null;
        return (
          <FullWidthImageBlock
            src={urlForImage(value.image)}
            alt={value.caption || ""}
            caption={value.caption}
          />
        );
      },
      brandedBodyImageSlider: ({
        value,
      }: {
        value: {
          images?: Array<{ image?: { asset?: unknown }; caption?: string }>;
        };
      }) => {
        const images = value?.images?.filter((i) => i?.image) ?? [];
        if (images.length === 0) return null;
        return (
          <ImageSliderBlock
            images={images}
            urlForImage={(src) => urlForImage(src as SanityImageSource)}
          />
        );
      },
    },
  };
}

function formatBlogDate(dateString?: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function WorkDetailClient({
  work,
  workImageUrl,
  heroImageUrl,
  relatedVideos = [],
}: BrandedDetailClientProps) {
  const router = useRouter();
  const isType2 = work.displayType === "type2";

  // Content2 그룹화 및 videoUrls 병합 (branded 전용)
  const processedContents = useMemo(() => {
    if (!work.contents) return [];

    const baseContent2Map = new Map<string, Content>();
    const attachContent2List: Content[] = [];

    work.contents.forEach((content) => {
      if (content.contentType === 2) {
        if (content.content2Role === 'base') {
          if (content._id) {
            baseContent2Map.set(content._id, { ...content });
          }
        } else if (content.content2Role === 'attach') {
          attachContent2List.push(content);
        } else {
          if (content._id) {
            baseContent2Map.set(content._id, { ...content });
          }
        }
      }
    });

    attachContent2List.forEach((attachContent) => {
      if (attachContent.attachToContentId) {
        const baseContent = baseContent2Map.get(attachContent.attachToContentId);
        if (baseContent) {
          const baseUrls = baseContent.videoUrls || [];
          const attachUrls = attachContent.videoUrls || [];
          baseContent.videoUrls = [...baseUrls, ...attachUrls];
        }
      }
    });

    const finalContents: Content[] = [];
    work.contents.forEach((content) => {
      if (content.contentType === 2 && content.content2Role === 'attach') {
        return;
      }
      if (content.contentType === 2 && content._id) {
        const mergedContent = baseContent2Map.get(content._id);
        if (mergedContent) {
          finalContents.push(mergedContent);
          return;
        }
      }
      finalContents.push(content);
    });

    return finalContents;
  }, [work.contents]);

  const { sectionRefs, activeIndex, scrollToIndex } = useScrollSectionNav(
    !isType2 && processedContents ? processedContents.length : 0
  );

  const renderContent = (content: Content, index: number) => {
    const commonProps = {
      category: content.category,
      subCategory: content.subCategory,
      date: content.date,
      title: content.title || "",
      description: content.description || "",
    };

    switch (content.contentType) {
      case 1:
        return (
          <Template1
            key={index}
            {...commonProps}
            videoUrl={content.videoUrl}
            videoUrls={undefined}
            images={content.images || []}
          />
        );
      case 2:
        return (
          <Template2
            key={index}
            {...commonProps}
            videoUrl={undefined}
            videoUrls={content.videoUrls}
          />
        );
      case 3:
        return (
          <Template3
            key={index}
            {...commonProps}
            images={content.images || []}
          />
        );
      case 4:
        return (
          <Template4
            key={index}
            {...commonProps}
            images={content.images || []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main
      className="w-full relative flex flex-col overflow-x-hidden pt-24"
      style={{ minHeight: "100vh" }}
    >
      {/* Type2: 히어로 이미지 (화면 width 가득) */}
      {isType2 && heroImageUrl && (
        <div className="w-screen relative left-1/2 -translate-x-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImageUrl}
            alt={work.title || ""}
            className="w-full h-[50vh] min-h-[300px] object-cover"
          />
        </div>
      )}

      <div className="flex-1 flex min-w-0">
        <div className="flex-1 px-8 py-8 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto"
          >
            {!isType2 && processedContents && processedContents.length > 0 && (
              <ScrollSectionNav
                items={processedContents.map((c) => ({
                  label: `Content ${c.contentType}`,
                }))}
                activeIndex={activeIndex}
                onSelect={scrollToIndex}
                className="mb-8"
              />
            )}
            {!isType2 && work.summary && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-16"
              >
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {work.summary}
                </div>
              </motion.div>
            )}

            {isType2 ? (
              <>
                {/* Type2: 제목, 부제, 브랜드|날짜, 구분선, 본문 */}
                <div className="mb-12">
                  <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
                    {work.title}
                  </h1>
                  {work.subtitle && (
                    <p className="text-gray-400 text-xl md:text-2xl mb-4">
                      {work.subtitle}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {[work.client, formatBlogDate(work.publishedAt)]
                      .filter(Boolean)
                      .join(" | ")}
                  </p>
                </div>
                <div className="w-full h-px bg-grey-700 mb-12" />
                {work.body && work.body.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="[&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-4 [&_h1]:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_a]:text-brand [&_a]:underline [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:text-gray-300 [&_li]:mb-1"
                  >
                    <PortableText
                      value={work.body}
                      components={getBodyPortableTextComponents()}
                    />
                  </motion.div>
                )}
              </>
            ) : (
              processedContents &&
              processedContents.length > 0 && (
                <div className="space-y-24">
                  {processedContents.map((content, index) => (
                    <div key={content._id || index} ref={sectionRefs(index)}>
                      {renderContent(content, index)}
                    </div>
                  ))}
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>

      <div className="w-full h-px bg-grey-700 mt-12 mb-12" />

      {relatedVideos && relatedVideos.length > 0 && (
        <div className="w-full">
          <RelationContentCard
            videos={relatedVideos.map((video) => ({
              ...video,
              onClick: () => {
                if (video.slug) router.push(`${BASE_PATH}/${video.slug}`);
              },
            }))}
            title="관련 영상을 더 찾으셨나요?"
          />
        </div>
      )}
    </main>
  );
}
