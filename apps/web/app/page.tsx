// 이 파일은 Next.js 앱의 최상위 라우트 컴포넌트를 정의한다.
import Link from "next/link";

export default function MainPage() {
  return (
    <div>
      <div>여기가 메인 페이지 입니다.</div>
      <Link href="/login">
        <button>로그인</button>
      </Link>
      <Link href="/board/create">
        <button>게시글 작성</button>
      </Link>
    </div>
  );
}
