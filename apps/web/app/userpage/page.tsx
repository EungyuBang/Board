"use client";

import { useEffect, useState } from "react";
import { User } from "../../types";
import Link from "next/link";

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
    setEditNickname(user?.nickname || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditNickname("");
  };

  const handleSaveEdit = async () => {
    if (!editNickname.trim()) return;
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await fetch("http://localhost:4000/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ nickname: editNickname }),
      });

      if (res.ok) {
        // 성공 시 화면 업데이트
        setUser((prev) => (prev ? { ...prev, nickname: editNickname } : null));
        setIsEditing(false);
        alert("닉네임이 변경되었습니다.");
      } else {
        alert("변경 실패");
      }
    } catch (e) {
      console.error(e);
      alert("오류 발생");
    }
  };

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
          if (!response.ok) {
            throw new Error("User 정보를 가져올 수 없습니다.");
          }
          const data = await response.json();
          setUser(data);
        } catch (e) {
          console.error("User 정보를 가져오는데 실패했습니다:", e);
        }
      };
      fetchUser();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">로그인이 필요합니다.</p>
      </div>
    );
  }

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
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-[rgb(37,147,255)] to-blue-400 flex items-center justify-center text-5xl font-bold text-white shadow-xl shadow-blue-200">
              {user.nickname?.[0] || "U"}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-400 border-4 border-white rounded-full"></div>
          </div>

          {/* 정보 영역 */}
          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <div>
              {isEditing ? (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <input
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className="text-3xl font-bold text-gray-800 mb-1 border-b-2 border-blue-500 focus:outline-none bg-transparent w-40"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap font-bold transition-colors"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-sm bg-gray-200 text-gray-600 px-4 py-2 rounded hover:bg-gray-300 whitespace-nowrap font-bold transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full group">
                  <h2 className="text-3xl font-bold text-gray-800 mb-1">
                    {user.nickname}
                  </h2>
                  <button
                    onClick={handleEdit}
                    className="bg-white text-gray-400 hover:text-blue-500 border border-gray-200 shadow-sm transition-all p-2 rounded-full hover:shadow-md"
                    title="닉네임 수정"
                  >
                    ✏️
                  </button>
                </div>
              )}
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

      <div className="mt-12 text-right border-t border-gray-200 pt-6">
        <button
          onClick={async () => {
            if (
              confirm(
                "정말로 탈퇴하시겠습니까? 작성한 모든 게시글과 댓글이 삭제되며 복구할 수 없습니다.",
              )
            ) {
              const accessToken = localStorage.getItem("accessToken");
              try {
                const res = await fetch("http://localhost:4000/users/me", {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (res.ok) {
                  alert("탈퇴가 완료되었습니다.");
                  localStorage.removeItem("accessToken");
                  window.location.href = "/";
                } else {
                  alert("탈퇴 처리에 실패했습니다.");
                }
              } catch (e) {
                console.error(e);
                alert("오류가 발생했습니다.");
              }
            }
          }}
          className="text-xs text-red-400 hover:text-red-600 underline font-medium hover:bg-red-50 px-3 py-2 rounded transition-colors"
        >
          회원 탈퇴하기
        </button>
      </div>
    </div>
  );
}
