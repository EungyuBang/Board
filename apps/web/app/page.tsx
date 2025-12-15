"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

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

    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:4000/post", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setPosts(data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchPosts();
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
          <h1
            className="text-3xl font-bold"
            style={{ color: "rgb(37, 147, 255)" }}
          >
            📋 게시판
          </h1>

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
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
          <span
            className="w-1 h-6 rounded-full"
            style={{ background: "rgb(37, 147, 255)" }}
          ></span>
          최신 게시글
        </h2>

        {posts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-600 text-lg">아직 게시글이 없습니다</p>
            <p className="text-gray-400 text-sm mt-2">
              첫 번째 글을 작성해보세요!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post: any) => (
              <Link href={`/board/${post.id}`} key={post.id}>
                <div
                  className="glass-card p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  style={{ borderColor: "transparent" }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[rgb(37,147,255)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span
                      className="px-2 py-1 rounded-full"
                      style={{
                        background: "rgba(37, 147, 255, 0.1)",
                        color: "rgb(37, 147, 255)",
                      }}
                    >
                      {post.author?.nickname || "알 수 없음"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
