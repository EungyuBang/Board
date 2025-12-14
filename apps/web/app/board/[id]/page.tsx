// notFound 함수 호출.
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 파라미터에서 id를 꺼냄.
  const { id } = await params;

  // [검증 로직] id가 '100'이면 404 문으로 쫓아냄.
  // (URL 파라미터는 무조건 string이므로 숫자 100이 아니라 문자열 '100'과 비교해야 함)
  if (id === "100") {
    notFound(); // 여기서 즉시 실행 종료 (return 안 해도 됨)
  }

  // 통과한 경우에만 아래 내용이 렌더링 됨.
  return (
    <div>
      <h1>게시글 상세 페이지</h1>
      <p>게시글 ID: {id}</p>
      <Link href={`/board/${id}/edit`}>
        <button>수정하기</button>
      </Link>
    </div>
  );
}
