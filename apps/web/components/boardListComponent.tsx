"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BoardListComponent() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:4000/post", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchPosts();
  }, []);

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
        <div className="grid gap-4">
          {posts.map((post: any) => (
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
                  <span className="text-gray-400">
                    💬 {post._count?.comments || 0}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
