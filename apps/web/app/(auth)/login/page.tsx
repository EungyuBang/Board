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

    // 3. 백엔드 API ("http://localhost:4000/auth/login")에 POST 요청을 보내세요.
    // - 성공하면:
    //    1) 받은 accessToken을 localStorage에 저장하세요: localStorage.setItem("accessToken", data.accessToken)
    //    2) 메인 페이지("/")로 이동하세요.
    // - 실패하면: 에러 메시지(alert) 띄우기
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const { accessToken } = await response.json();
      localStorage.setItem("accessToken", accessToken);
      alert("로그인 성공");
      router.push("/");
    } catch (error) {
      alert("로그인 실패");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">로그인</h1>
      {/* 
        4. form 태그와 input 태그들을 작성하세요. 
        - username, password 입력 칸이 필요합니다.
        - 로그인 버튼을 만드세요.
      */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        {/* 여기에 input 2개 (username, password) 만드시면 됩니다! */}
        <input
          type="text"
          name="username"
          value={formdata.username}
          onChange={inputChangeHandler}
          placeholder="username"
        />
        <input
          type="password"
          name="password"
          value={formdata.password}
          onChange={inputChangeHandler}
          placeholder="password"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          로그인
        </button>
        <Link href="/signup">회원가입</Link>
      </form>
    </div>
  );
}
