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
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
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
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link
            href="/"
            className="text-gray-500 hover:text-accent transition-colors text-sm flex items-center gap-1 font-medium"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-10 mb-10 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10">
          {/* 프로필 이미지 영역 */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-accent to-blue-400 flex items-center justify-center text-5xl font-bold text-white shadow-xl shadow-blue-200">
              {user.nickname?.[0] || "U"}
            </div>
          </div>

          {/* 정보 영역 */}
          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-between w-full group mb-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editNickname}
                      onChange={(e) => setEditNickname(e.target.value)}
                      className="text-3xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none bg-transparent w-40"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="text-xs bg-accent text-white px-3 py-1.5 rounded-lg hover:bg-accent-hover font-bold transition-colors"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 font-bold transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {user.nickname}
                    </h2>
                    <button
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-accent transition-colors p-2"
                      title="닉네임 수정"
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>
              <p className="text-gray-500 font-medium tracking-wide">
                {user.username}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-50">
              <div className="bg-gray-50 p-4 rounded-xl text-left">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1">
                  이메일
                </label>
                <p className="text-gray-700 font-bold">{user.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-left">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold block mb-1">
                  가입일
                </label>
                <p className="text-gray-700 font-bold">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString("ko-KR", {
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <span className="text-2xl">✏️</span>
            내가 쓴 글
            <span className="bg-blue-50 text-accent text-sm px-2 py-0.5 rounded-full font-bold ml-1">
              {user.posts?.length || 0}
            </span>
          </h3>

          <div className="space-y-4">
            {user.posts?.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
                작성한 글이 없습니다.
              </div>
            ) : (
              user.posts?.map((post) => (
                <Link
                  href={`/board/${post.id}`}
                  key={post.id}
                  className="group block bg-white rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-100 hover:border-blue-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg text-gray-800 group-hover:text-accent transition-colors">
                        {post.title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                      {new Date(post.createdAt).toLocaleString("ko-KR", {
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
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
    </div>
  );
}
