import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Create Next App",
  description: "About page",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}

