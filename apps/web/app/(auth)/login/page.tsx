import Link from "next/link";

// login 성공 후 다시 /로 이동하는 코드를 작성할 예정

export default function Login() {
  return (
    <div>
      <div>여기가 로그인 페이지 입니다</div>
      <Link href="/signup">
        <button>회원가입</button>
      </Link>
    </div>
  );
}
