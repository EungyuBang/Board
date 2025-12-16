"use client";

// 게시글 리스트 컴퍼넌트
// app/page.tsx에서 사용한다 (mainPage 에서 렌더링 되어야 하니까)

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "../../types";

export default function BoardListComponent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/post?page=${page}&limit=${limit}`,
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
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
        <span
          className="w-1 h-6 rounded-full"
          style={{ background: "rgb(37, 147, 255)" }}
        ></span>
        최신 게시글
      </h2>

      {posts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-600 text-lg">아직 게시글이 없습니다</p>
          <p className="text-gray-400 text-sm mt-2">
            첫 번째 글을 작성해보세요!
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-6">
            {posts.map((post) => (
              <Link href={`/board/${post.id}`} key={post.id}>
                <div
                  className="glass-card p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  style={{ borderColor: "transparent" }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[rgb(37,147,255)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span
                      className="px-2 py-1 rounded-full"
                      style={{
                        background: "rgba(37, 147, 255, 0.1)",
                        color: "rgb(37, 147, 255)",
                      }}
                    >
                      {post.author?.nickname || "알 수 없음"}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                    <span className="text-gray-400">
                      💬 {post._count?.comments || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "transparent",
                color: "#6b7280",
                boxShadow: "none",
              }}
            >
              ← 이전
            </button>
            <span className="text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "transparent",
                color: "#6b7280",
                boxShadow: "none",
              }}
            >
              다음 →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
