import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
      <Link href="/">홈으로 돌아가기</Link>
    </div>
  );
}
