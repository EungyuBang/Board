"use client";

import { useEffect, useState } from "react";
import { User } from "../../types";
import Link from "next/link";

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:4000/users/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
          throw new Error("User 정보를 가져올 수 없습니다.");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("User 정보를 가져오는데 실패했습니다:", error);
      }
    };
    fetchUserInfo();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        로딩중...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-6">
        <Link
          href="/"
          className="text-gray-500 hover:text-[rgb(37,147,255)] transition-colors text-sm flex items-center gap-1"
        >
          ← 메인으로 돌아가기
        </Link>
      </div>

      <div className="glass-card p-10 mb-10">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
          <span className="w-1.5 h-8 bg-[rgb(37,147,255)] rounded-full"></span>
          마이 페이지
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* 프로필 이미지 영역 */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[rgb(37,147,255)] to-blue-400 flex items-center justify-center text-5xl font-bold text-white shadow-xl shadow-blue-200">
              {user.nickname?.[0] || "U"}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-400 border-4 border-white rounded-full"></div>
          </div>

          {/* 정보 영역 */}
          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">
                {user.nickname}
              </h2>
              <p className="text-gray-500 font-medium tracking-wide">
                {user.username}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1">
                  이메일
                </label>
                <p className="text-gray-700 font-medium">{user.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1">
                  가입일
                </label>
                <p className="text-gray-700 font-medium">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <span className="text-2xl">✏️</span>
          내가 쓴 글
          <span className="bg-blue-50 text-[rgb(37,147,255)] text-sm px-2 py-0.5 rounded-full font-bold ml-1">
            {user.posts?.length || 0}
          </span>
        </h3>

        <div className="grid gap-4">
          {user.posts?.length === 0 ? (
            <div className="glass-card p-12 text-center text-gray-500">
              작성한 글이 없습니다.
            </div>
          ) : (
            user.posts?.map((post) => (
              <Link
                href={`/board/${post.id}`}
                key={post.id}
                className="group block glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-transparent hover:border-l-[rgb(37,147,255)]"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-lg text-gray-800 group-hover:text-[rgb(37,147,255)] transition-colors">
                      {post.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                    {new Date(post.createdAt).toLocaleString("ko-KR", {
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
