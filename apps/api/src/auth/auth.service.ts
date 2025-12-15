import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";

import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 1. 이메일 중복 체크
    const existingUser = await this.prisma.user.findUnique({
      where: { username: registerDto.username },
    });

    if (existingUser) {
      throw new ConflictException("이미 존재하는 username입니다.");
    }

    // 2. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 3. User 생성
    const user = await this.prisma.user.create({
      data: {
        username: registerDto.username,
        password: hashedPassword,
        nickname: registerDto.nickname,
        // email: registerDto.email, // 이메일이 선택사항이면 생략 가능
      },
    });

    // 비밀번호 제외하고 반환
    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // 1. username을 기준으로 유저를 찾습니다.
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException("아이디가 존재하지 않습니다.");
    }

    // 2. 비밀번호 확인
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
    }

    // 3. 토큰 발급
    const accessToken = this.jwtService.sign({
      username: user.username,
      sub: user.id, // 일반적으로 user id도 payload에 넣습니다
    });

    return { accessToken };
  }
}
