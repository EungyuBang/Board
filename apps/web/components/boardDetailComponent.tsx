"use client";

// 게시글 상세 컴퍼넌트
// board/[id]/page.tsx에서 사용한다

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Post, User } from "../types";

export default function BoardDetailComponent() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [boardinfo, setBoardInfo] = useState<Post | null>(null);
  const [userinfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const fetchData = async () => {
      try {
        // 게시글 정보 가져오기
        // 이건 로그인 안 해도 보게 할거니까 토큰을 안 보냄
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const boardRes = await fetch(`${API_URL}/post/${postId}`);
        if (!boardRes.ok) throw new Error("게시글을 불러올 수 없습니다.");
        const boardData = await boardRes.json();
        setBoardInfo(boardData);

        if (accessToken) {
          const userRes = await fetch(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setUserInfo(userData);
          }
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_URL}/post/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        alert("게시글이 삭제되었습니다.");
        router.push("/");
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    }
  };

  if (!boardinfo) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">게시글을 찾을 수 없습니다.</p>
        <Link href="/" className="text-blue-500 hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const isAuthor = userinfo && boardinfo.authorId === userinfo.id;

  return (
    <div className="animate-fade-in">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>

      {/* Detail Card */}
      <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
          {boardinfo.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-accent font-bold px-2 py-1 rounded-md text-xs">
              {boardinfo.author?.nickname || "알 수 없음"}
            </span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="font-medium">
            {new Date(boardinfo.createdAt).toLocaleString("ko-KR", {
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="text-gray-700 leading-relaxed mb-12 whitespace-pre-wrap min-h-25 text-lg">
          {boardinfo.content}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
          {isAuthor ? (
            <>
              <Link href={`/board/${postId}/edit`}>
                <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 font-bold py-2 px-4 rounded-xl hover:bg-gray-50 transition-all text-sm">
                  ✏️ 수정하기
                </button>
              </Link>
              <button
                className="flex items-center gap-2 bg-red-50 text-red-500 font-bold py-2 px-4 rounded-xl hover:bg-red-100 transition-all text-sm"
                onClick={handleDelete}
              >
                🗑️ 삭제하기
              </button>
            </>
          ) : (
            <div className="h-8"></div> // Spacer to keep layout if not author
          )}
        </div>
      </article>
    </div>
  );
}
