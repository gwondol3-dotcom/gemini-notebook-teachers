import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);

  return {
    title: "Gemini Notebook 교사 연수",
    description:
      "초·중·고 교사를 위한 Gemini Notebook 2시간 실습 페이지. 소스 구성, 질문, 업무·수업 활용, 스튜디오 결과물과 검증을 익힙니다.",
    metadataBase: baseUrl,
    openGraph: {
      title: "Gemini Notebook 교사 연수",
      description: "자료를 읽고, 근거를 확인하고, 수업과 업무에 연결하는 120분 실습",
      type: "website",
      images: [{ url: "/og.png", width: 1728, height: 909, alt: "Gemini Notebook 교사 연수" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Gemini Notebook 교사 연수",
      description: "초·중·고 교사를 위한 120분 실습",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
