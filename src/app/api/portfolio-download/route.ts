import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

const PORTFOLIO_DOWNLOAD_QUERY = `*[_type == "portfolioDownload"][0] {
  title,
  url
}`;

export async function GET() {
  try {
    const portfolio = await client.fetch(PORTFOLIO_DOWNLOAD_QUERY);

    if (!portfolio || !portfolio?.url) {
      return NextResponse.json(
        { error: "포트폴리오 링크를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      title: portfolio.title,
      url: portfolio.url,
    });
  } catch (error) {
    console.error("포트폴리오 링크 가져오기 오류:", error);
    return NextResponse.json(
      { error: "포트폴리오 링크를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
