"use client";

import CommentComponent from "@/components/commentComponent";
import BoardDetailComponent from "@/components/boardDetailComponent";

export default function BoardDetailPage() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <BoardDetailComponent />
        <CommentComponent />
      </div>
    </div>
  );
}
