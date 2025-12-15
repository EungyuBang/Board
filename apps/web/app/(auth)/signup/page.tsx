"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();

  // 1. 여기에 form 데이터를 저장할 state를 만드세요.
  // (username, password, nickname, email 4가지 필드가 필요합니다)
  const [formdata, setFromData] = useState({
    username: "",
    password: "",
    nickname: "",
    email: "",
  });

  // 2. input 값이 바뀔 때마다 state를 업데이트하는 함수를 만드세요.
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 3. 백엔드 API ("http://localhost:4000/auth/register")에 POST 요청을 보내세요.
    // - 성공하면: 로그인 페이지("/login")로 이동
    // - 실패하면: 에러 메시지(alert) 띄우기
    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.");
      }
      alert("회원가입이 완료되었습니다.");
      router.push("/login");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ color: "rgb(37, 147, 255)" }}
          >
            회원가입
          </h1>
          <p className="text-gray-500 mt-2">새 계정을 만드세요</p>
        </div>

        {/* 
          4. form 태그와 input 태그들을 작성하세요. 
          - 각 input에는 name, value, onChange를 연결해야 합니다.
          - type="password" 주의하세요.
          - 마지막엔 submit 버튼이 필요합니다.
        */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 여기에 input 4개 만드시면 됩니다! */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">아이디</label>
            <input
              type="text"
              name="username"
              value={formdata.username}
              onChange={inputChangeHandler}
              placeholder="아이디를 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">비밀번호</label>
            <input
              type="password"
              name="password"
              value={formdata.password}
              onChange={inputChangeHandler}
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formdata.nickname}
              onChange={inputChangeHandler}
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">이메일</label>
            <input
              type="email"
              name="email"
              value={formdata.email}
              onChange={inputChangeHandler}
              placeholder="이메일을 입력하세요"
            />
          </div>
          <button type="submit" className="w-full mt-4">
            가입하기
          </button>
          <p className="text-center text-gray-500 text-sm mt-4">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" style={{ color: "rgb(37, 147, 255)" }}>
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
