"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Comment, User } from "../types";

export default function CommentComponent() {
  const params = useParams();
  const postId = params.id; // 게시글 ID
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");

  // 수정 관련 State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // 현재 로그인한 유저 정보
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 현재 유저 정보 가져오기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const fetchUser = async () => {
        try {
          const res = await fetch(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUser();
    }
  }, []);

  // 댓글 목록 불러오기
  const fetchComments = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_URL}/comment/post/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [postId]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchComments();
  }, [fetchComments]);

  // 댓글 작성
  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!content) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_URL}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content, postId: Number(postId) }),
      });

      if (res.ok) {
        setContent("");
        fetchComments();
      } else {
        alert("댓글 작성 실패");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 삭제
  const handleDelete = async (commentId: number) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const accessToken = localStorage.getItem("accessToken");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_URL}/comment/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        fetchComments();
      } else {
        alert("삭제 권한이 없거나 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 수정 모드 시작
  const startEditing = (commentId: number, currentContent: string) => {
    setEditingId(commentId);
    setEditContent(currentContent);
  };

  // 수정 취소
  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  // 수정 저장
  const saveEdit = async (commentId: number) => {
    if (!confirm("수정하시겠습니까?")) return;
    const accessToken = localStorage.getItem("accessToken");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${API_URL}/comment/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (res.ok) {
        setEditingId(null); // 수정 모드 종료
        fetchComments(); // 목록 갱신
      } else {
        alert("수정 권한이 없거나 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-4">댓글 ({comments.length})</h3>

      {/* 댓글 작성 폼 */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 남겨보세요"
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 rounded-lg font-bold hover:bg-blue-600 transition-colors"
        >
          등록
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-700">
                {comment.author?.nickname || "익명"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>

                {/* 수정 모드가 아닐 때 + 본인 댓글일 때만 수정/삭제 버튼 노출 */}
                {editingId !== comment.id &&
                  currentUser?.id === comment.authorId && (
                    <>
                      <button
                        onClick={() =>
                          startEditing(comment.id, comment.content)
                        }
                        className="text-xs text-blue-400 hover:text-blue-600 ml-2"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-red-400 hover:text-red-600 ml-1"
                      >
                        삭제
                      </button>
                    </>
                  )}
              </div>
            </div>

            {/* 수정 모드일 때 vs 아닐 때 */}
            {editingId === comment.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 p-2 border border-blue-300 rounded focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => saveEdit(comment.id)}
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  저장
                </button>
                <button
                  onClick={cancelEditing}
                  className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                >
                  취소
                </button>
              </div>
            ) : (
              <p className="text-gray-600">{comment.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
