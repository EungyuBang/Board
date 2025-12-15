"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditBoard() {
  const { id } = useParams();
  const router = useRouter();

  const [title, serTitle] = useState("");
  const [content, setContent] = useState("");

  // 기존 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:4000/post/${id}`);
      const data = await res.json();
      serTitle(data.title);
      setContent(data.content);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인 정보가 없습니다");
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/post/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        alert("게시글이 수정되었습니다.");
        router.push(`http://localhost:3000/board/${id}`);
      } else {
        alert("수정에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    }
  };
  return (
    <div className="animate-fade-in">
      <div className="glass-card p-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/board/${id}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
          >
            ← 게시글로 돌아가기
          </Link>
        </div>

        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: "rgb(37, 147, 255)" }}
        >
          게시글 수정
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => serTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg h-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              placeholder="내용을 입력하세요"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-transform active:scale-95 duration-200 shadow-md hover:shadow-lg"
            >
              수정 완료 ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
