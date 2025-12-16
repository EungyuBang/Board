"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BoardListComponent from "@/components/boardComponents/boardListComponent";

export default function MainPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    // 1. localStorage에서 토큰("accessToken")이 있는지 확인하고 state를 업데이트하세요.
    // (있으면 true, 없으면 false)
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // eslint-disable-next-line
      setIsLoggedIn(true);

      const fetchUser = async () => {
        try {
          const response = await fetch("http://localhost:4000/users/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          }
        } catch (e) {
          console.log(e);
        }
      };
      fetchUser();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUser({});
    alert("로그아웃 되었습니다");
    router.push("/");
  };

  return (
    <div className="animate-fade-in">
      {/* 헤더 영역 */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1
              className="text-3xl font-bold"
              style={{ color: "rgb(37, 147, 255)" }}
            >
              게시판
            </h1>
          </Link>
          {isLoggedIn ? (
            // === 로그인 중일 때 보여줄 화면 ===
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                환영합니다,{" "}
                <span
                  className="font-semibold"
                  style={{ color: "rgb(37, 147, 255)" }}
                >
                  {user?.nickname}
                </span>
                님! 🎉
              </span>
              <Link href="/board/create">
                <button className="text-sm py-2 px-4">✏️ 글쓰기</button>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm py-2 px-4"
                style={{ background: "#e5e7eb", color: "#374151" }}
              >
                로그아웃
              </button>
            </div>
          ) : (
            // === 로그인 안 했을 때 보여줄 화면 ===
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button className="text-sm py-2 px-4">로그인</button>
              </Link>
              <Link href="/signup">
                <button
                  className="text-sm py-2 px-4"
                  style={{ background: "#e5e7eb", color: "#374151" }}
                >
                  회원가입
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 게시글 목록 */}
      <BoardListComponent />
    </div>
  );
}
