"use client";

import BoardListComponent from "@/components/boardListComponent";
import HeaderComponent from "@/components/headerComponent";

export default function MainPage() {
  return (
    <div className="animate-fade-in">
      <HeaderComponent />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <BoardListComponent />
      </main>
    </div>
  );
}
