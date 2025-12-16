"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BoardCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        alert("작성 성공!");
        router.push("/");
      } else {
        alert("작성 실패");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold mb-8 text-gray-800">
            새 게시글 작성
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                내용
              </label>
              <textarea
                placeholder="내용을 자유롭게 입력해주세요..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl h-80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-8 mt-4">
            <button
              onClick={handleSubmit}
              className="btn-primary py-3 px-8 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              게시글 등록하기 ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
