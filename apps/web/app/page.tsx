"use client";

import BoardListComponent from "@/components/boardListComponent";
import HeaderComponent from "@/components/headerComponent";

export default function MainPage() {
  return (
    <div className="animate-fade-in">
      <HeaderComponent />
      <BoardListComponent />
    </div>
  );
}
