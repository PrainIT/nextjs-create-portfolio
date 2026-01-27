"use client";

import { useRouter } from "next/navigation";
import ContentCard from "@/components/ContentCard";

export interface BrandedProject {
  id: string;
  title: string;
  tags?: string[];
  image?: string;
  category?: string;
  subCategory?: string | string[];
  slug?: string;
  client?: string;
  publishedAt?: string;
}

interface BrandedPageClientProps {
  workProjects: BrandedProject[];
}

export default function BrandedPageClient({
  workProjects,
}: BrandedPageClientProps) {
  const router = useRouter();

  const handleProjectClick = (project: BrandedProject) => {
    if (project.slug) {
      router.push(`/branded/${project.slug}`);
    }
  };

  return (
    <main
      className="w-full relative flex flex-col overflow-x-hidden pt-24"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-full h-px bg-grey-700" />

      <div className="flex-1 py-8 px-8 min-w-0 pt-24">
        <div className="grid grid-cols-3 gap-6">
          {workProjects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="cursor-pointer hover:opacity-90 transition-opacity"
            >
              <ContentCard
                id={index + 1}
                title={project.title}
                image={project.image}
                forceSquare={true}
                contentType={undefined}
              />
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
