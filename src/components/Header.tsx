import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="mt-[60px] mx-auto mb-[60px]">
      <nav className="flex items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={180}
            height={120}
            priority
            className="h-auto"
          />
        </Link>
        <div className="flex items-center gap-[55px]">
          <Link
            href="/about"
            className="text-secondary-4 opacity-50 text-base hover:opacity-100 transition-opacity"
          >
            ABOUT
          </Link>
          <Link
            href="/work"
            className="text-secondary-4 opacity-50 text-base hover:opacity-100 transition-opacity"
          >
            WORK
          </Link>
          <Link
            href="/contact"
            className="text-secondary-4 opacity-50 text-base hover:opacity-100 transition-opacity"
          >
            CONTACT
          </Link>
          <Link
            href="/portfolio-download"
            className="text-brand opacity-100 text-base hover:opacity-80 transition-opacity"
          >
            PORTFOLIO DOWNLOAD
          </Link>
        </div>
      </nav>
    </header>
  );
}

