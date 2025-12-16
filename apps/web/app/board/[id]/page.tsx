"use client";

import CommentSection from "@/components/commentComponent";
import BoardDetailComponent from "@/components/boardComponents/boardDetailComponent";

export default function BoardDetailPage() {
  return (
    <div className="animate-fade-in">
      <div className="glass-card p-8 max-w-3xl mx-auto">
        <BoardDetailComponent />
        <CommentSection />
      </div>
    </div>
  );
}
