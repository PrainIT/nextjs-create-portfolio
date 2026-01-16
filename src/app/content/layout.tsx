export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full relative">{children}</div>;
}
