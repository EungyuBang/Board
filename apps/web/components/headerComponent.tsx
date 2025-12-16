"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/types";

// 헤더 컴포넌트
// app/page 에서 사용

export default function HeaderComponent() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. localStorage에서 토큰("accessToken")이 있는지 확인하고 state를 업데이트.
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
    setUser(null);
    alert("로그아웃 되었습니다");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm/50">
      {/* 헤더 영역 - Full Width Navbar styling */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h1 className="text-2xl font-bold text-accent tracking-tight">
              Board
            </h1>
          </div>
        </Link>

        {isLoggedIn ? (
          // === 로그인 중일 때 보여줄 화면 ===
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">
              <Link
                href="/userpage"
                className="hover:opacity-80 transition-opacity"
              >
                <span className="text-accent font-bold">{user?.nickname}</span>{" "}
                님
              </Link>
            </span>
            <Link href="/board/create">
              <button className="btn-primary flex items-center gap-2 py-1.5 px-4 text-sm shadow-none hover:shadow-md">
                ✏️ 글쓰기
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-50 text-gray-600 border border-gray-200 px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all"
            >
              로그아웃
            </button>
          </div>
        ) : (
          // === 로그인 안 했을 때 보여줄 화면 ===
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-gray-600 px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
                로그인
              </button>
            </Link>
            <Link href="/signup">
              <button className="btn-primary py-1.5 px-4 text-sm shadow-none hover:shadow-md">
                회원가입
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
