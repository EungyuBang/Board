"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  // 1. 여기에 form 데이터를 저장할 state를 만드세요.
  // (username, password 2가지 필드가 필요합니다)
  const [formdata, setFromData] = useState({
    username: "",
    password: "",
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

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      if (!response.ok) {
        // 401 Unauthorized 등을 처리
        const errorData = await response.json();
        alert(errorData.message || "로그인에 실패했습니다.");
        return;
      }

      const { accessToken } = await response.json();
      localStorage.setItem("accessToken", accessToken);
      alert("로그인 성공! 🎉");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent mb-2">로그인</h1>
          <p className="text-gray-500 text-sm font-medium">
            계정에 로그인하세요
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
          <button
            type="submit"
            className="btn-primary w-full py-4 text-base font-bold mt-2 hover:-translate-y-0.5 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            로그인
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="text-accent font-bold hover:underline transition-all"
              >
                회원가입
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
