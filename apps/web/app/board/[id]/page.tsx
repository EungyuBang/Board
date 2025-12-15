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
    <div className="animate-fade-in">
      <div className="glass-card p-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>

        <article>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            여기에 해당 게시글의 제목이 들어옵니다
          </h1>
          <div className="border-b border-gray-200 mb-6 pb-4">
            <span className="text-sm text-gray-400">게시글 #{id}</span>
          </div>
          <p className="text-gray-600 leading-relaxed mb-8">
            여기에 해당 게시글의 내용이 들어옵니다
          </p>
        </article>

        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <Link href={`/board/${id}/edit`}>
            <button className="text-sm py-2 px-4">✏️ 수정하기</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
