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
    <div className="animate-fade-in max-w-6xl mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={`/board/${id}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
          >
            ← 게시글로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold mb-8 text-gray-800">게시글 수정</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => serTitle(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                placeholder="제목을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl h-80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed"
                placeholder="내용을 입력하세요"
              ></textarea>
            </div>

            <div className="flex justify-end pt-8 mt-4">
              <button
                onClick={handleSubmit}
                className="btn-primary py-3 px-8 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                수정 완료 ✨
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
