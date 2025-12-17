"use client";

// 게시글 리스트 컴퍼넌트
// app/page.tsx에서 사용한다 (mainPage 에서 렌더링 되어야 하니까)

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "../types";

export default function BoardListComponent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchPosts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(
          `${API_URL}/post?page=${page}&limit=${limit}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        if (response.ok) {
          const { data, meta } = await response.json();
          setPosts(data);
          setTotalPages(meta.totalPages);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchPosts();
  }, [page, limit]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="mb-10 animate-fade-in">
      {/* Title Section */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-accent rounded-full"></span>
          최신 게시글
        </h2>
        <span className="bg-blue-50 text-accent text-xs font-bold px-2 py-1 rounded-full">
          {posts.length}개
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-800 text-lg font-bold mb-2">
            아직 게시글이 없습니다
          </p>
          <p className="text-gray-400 text-sm">
            첫 번째 글을 작성하여 커뮤니티를 시작해보세요!
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-8">
            {posts.map((post) => (
              <Link href={`/board/${post.id}`} key={post.id}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-accent transition-colors mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <span>💬 {post._count?.comments || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-4">
                    <span className="bg-blue-50 text-accent px-2 py-1 rounded-md text-xs font-bold">
                      {post.author?.nickname || "알 수 없음"}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs">
                      {new Date(post.createdAt).toLocaleString("ko-KR", {
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 font-medium transition-colors"
            >
              ← 이전
            </button>
            <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
              {page}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 font-medium transition-colors"
            >
              다음 →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
