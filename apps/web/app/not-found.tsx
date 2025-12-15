import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="glass-card p-12 text-center max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: "rgb(37, 147, 255)" }}
        >
          404
        </h1>
        <p className="text-xl text-gray-700 mb-2">페이지를 찾을 수 없습니다</p>
        <p className="text-gray-500 mb-8">
          죄송합니다. 요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link href="/">
          <button>🏠 홈으로 돌아가기</button>
        </Link>
      </div>
    </div>
  );
}
