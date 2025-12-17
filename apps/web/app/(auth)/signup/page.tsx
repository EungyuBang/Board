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

  // input 값이 바뀔 때마다 state를 업데이트하는 함수.
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 백엔드 API ("http://localhost:4000/auth/register")에 POST 요청.
    // - 성공하면: 로그인 페이지("/login")로 이동
    // - 실패하면: 에러 메시지(alert) 띄우기
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      if (!response.ok) {
        // server에서 json type으로 넘어온걸 받기 위해 await response.json()을 사용
        // json 을 object로 변환
        const errorData = await response.json();
        throw new Error(errorData.message || "회원 가입에 실패하였습니다");
      }
      alert("회원가입이 완료되었습니다.");
      router.push("/login");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="min-h-[80vh] flex items-center justify-center animate-fade-in py-10">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-accent mb-2">회원가입</h1>
            <p className="text-gray-500 text-sm font-medium">
              새 계정을 만드세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                아이디
              </label>
              <input
                type="text"
                name="username"
                value={formdata.username}
                onChange={inputChangeHandler}
                placeholder="아이디를 입력하세요"
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formdata.password}
                onChange={inputChangeHandler}
                placeholder="비밀번호를 입력하세요"
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                닉네임
              </label>
              <input
                type="text"
                name="nickname"
                value={formdata.nickname}
                onChange={inputChangeHandler}
                placeholder="닉네임을 입력하세요"
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formdata.email}
                onChange={inputChangeHandler}
                placeholder="이메일을 입력하세요"
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium bg-gray-50 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-base font-bold mt-2 hover:-translate-y-0.5 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              가입하기
            </button>

            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">
                이미 계정이 있으신가요?{" "}
                <Link
                  href="/login"
                  className="text-accent font-bold hover:underline transition-all"
                >
                  로그인
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
