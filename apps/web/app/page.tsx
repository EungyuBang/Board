"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 1. localStorage에서 토큰("accessToken")이 있는지 확인하고 state를 업데이트하세요.
    // (있으면 true, 없으면 false)
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // eslint-disable-next-line
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    // 2. 로그아웃 기능을 만드세요.
    // (localStorage에서 토큰 삭제 + state false로 변경 + alert "로그아웃 되었습니다")
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다");
    router.push("/");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-10">메인 페이지</h1>

      {isLoggedIn ? (
        // === 로그인 중일 때 보여줄 화면 ===
        <div className="flex flex-col gap-4">
          <p className="text-xl">환영합니다! 🎉</p>

          <Link href="/board/create">
            <button>게시글 작성</button>
          </Link>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        // === 로그인 안 했을 때 보여줄 화면 ===
        <div className="flex flex-col gap-4">
          <p className="text-xl">로그인이 필요합니다.</p>
          <Link href="/login">
            <button>로그인</button>
          </Link>
          <Link href="/signup">
            <button>회원가입</button>
          </Link>
        </div>
      )}
    </div>
  );
}
