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
  const id = params.id;

  const [boardinfo, setBoardInfo] = useState<Post | null>(null);
  const [userinfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const fetchData = async () => {
      try {
        const boardRes = await fetch(`http://localhost:4000/post/${id}`);
        if (!boardRes.ok) throw new Error("게시글을 불러올 수 없습니다.");
        const boardData = await boardRes.json();
        setBoardInfo(boardData);

        if (accessToken) {
          const userRes = await fetch(`http://localhost:4000/users/me`, {
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
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/post/${id}`, {
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
    <>
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>

      <article>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {boardinfo.title}
        </h1>

        <div className="border-b border-gray-200 mb-8 pb-4 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">
              {boardinfo.author?.nickname || "알 수 없음"}
            </span>
            <span className="text-gray-300">|</span>
            <span>{new Date(boardinfo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="text-gray-700 leading-relaxed mb-12 whitespace-pre-wrap min-h-[50]">
          {boardinfo.content}
        </div>
      </article>

      {isAuthor && (
        <div className="flex gap-3 pt-6 border-t border-gray-200 justify-end">
          <Link href={`/board/${id}/edit`}>
            <button className="text-sm py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors">
              ✏️ 수정하기
            </button>
          </Link>
          <button
            className="text-sm py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
            onClick={handleDelete}
          >
            🗑️ 삭제하기
          </button>
        </div>
      )}
    </>
  );
}
