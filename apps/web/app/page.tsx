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
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-10">메인 페이지</h1>

      {isLoggedIn ? (
        // === 로그인 중일 때 보여줄 화면 ===
        <div className="flex flex-col gap-4">
          <p className="text-xl">환영합니다! {user?.nickname}님! 🎉</p>
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

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">게시글 목록 📝</h2>
        <div className="flex flex-col gap-4">
          {posts.map((post: any) => (
            <div
              key={post.id}
              className="border p-4 rounded shadow hover:bg-gray-50 transition-colors"
            >
              <Link href={`/board/${post.id}`}>
                <h3 className="text-xl font-bold mb-2 cursor-pointer text-blue-600 hover:text-blue-800">
                  {post.title}
                </h3>
              </Link>
              <p className="mb-2 text-gray-700 line-clamp-3">{post.content}</p>
              <p className="text-sm text-gray-500">
                작성자: {post.author?.nickname || "알 수 없음"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
