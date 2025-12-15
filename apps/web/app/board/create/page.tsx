import Link from "next/link";

export default function BoardPage() {
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

        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: "rgb(37, 147, 255)" }}
        >
          새 게시글 작성
        </h1>

        <p className="text-gray-500">작성 폼이 여기에 들어갑니다.</p>
      </div>
    </div>
  );
}
