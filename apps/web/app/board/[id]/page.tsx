"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // 상태 관리
  const [boardinfo, setBoardInfo] = useState(null);
  const [userinfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage 접근은 useEffect 내부에서 안전하게 실행
    const accessToken = localStorage.getItem("accessToken");

    const fetchData = async () => {
      try {
        // 1. 게시글 상세 정보 가져오기
        const boardRes = await fetch(`http://localhost:4000/post/${id}`);
        if (!boardRes.ok) throw new Error("게시글을 불러올 수 없습니다.");
        const boardData = await boardRes.json();
        setBoardInfo(boardData);

        // 2. 로그인한 유저 정보 가져오기 (토큰이 있을 때만)
        if (accessToken) {
          const userRes = await fetch(`http://localhost:4000/users/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setUserInfo(userData);
          }
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="glass-card p-8 max-w-3xl mx-auto flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500 animate-pulse">로딩 중... ⏳</div>
        </div>
      </div>
    );
  }

  // 데이터가 없을 때
  if (!boardinfo) {
    return (
      <div className="animate-fade-in">
        <div className="glass-card p-8 max-w-3xl mx-auto text-center">
          <p className="text-gray-500 mb-4">게시글을 찾을 수 없습니다.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 본인 글 확인 (userinfo가 있고, 작성자 ID가 일치할 때)
  const isAuthor = userinfo && boardinfo.authorId === userinfo.id;

  // 삭제하기 버튼 로직 구현
  const handleDelete = async () => {
    // 사용자 확인 (confirm)
    if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    // 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    try {
      // DELETE 요청 보내기
      const res = await fetch(`http://localhost:4000/post/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // 결과 처리
      if (res.ok) {
        alert("게시글이 삭제되었습니다.");
        router.push("/"); // 목록으로 이동 (useRouter 필요!)
      } else {
        alert("삭제에 실패했습니다.");
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
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>

        <article>
          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {boardinfo.title}
          </h1>

          {/* 메타 정보 (작성자, 날짜) */}
          <div className="border-b border-gray-200 mb-8 pb-4 flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700">
                {boardinfo.author?.nickname || "알 수 없음"}
              </span>
              <span className="text-gray-300">|</span>
              <span>{new Date(boardinfo.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* 본문 내용 */}
          <div className="text-gray-700 leading-relaxed mb-12 whitespace-pre-wrap min-h-[200px]">
            {boardinfo.content}
          </div>
        </article>

        {/* 하단 버튼 영역 */}
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
      </div>
    </div>
  );
}
