"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">회원가입</h1>
      {/* 
        4. form 태그와 input 태그들을 작성하세요. 
        - 각 input에는 name, value, onChange를 연결해야 합니다.
        - type="password" 주의하세요.
        - 마지막엔 submit 버튼이 필요합니다.
      */}
      <div>
        {/* 여기에 input 4개 만드시면 됩니다! */}
        <input
          type="text"
          name="username"
          value={formdata.username}
          onChange={inputChangeHandler}
          placeholder="ID"
        />
        <input
          type="password"
          name="password"
          value={formdata.password}
          onChange={inputChangeHandler}
          placeholder="PASSWORD"
        />
        <input
          type="text"
          name="nickname"
          value={formdata.nickname}
          onChange={inputChangeHandler}
          placeholder="NICKNAME"
        />
        <input
          type="email"
          name="email"
          value={formdata.email}
          onChange={inputChangeHandler}
          placeholder="EMAIL"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
