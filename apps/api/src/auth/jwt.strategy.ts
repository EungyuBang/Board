import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

// Injectable : NestJS에서 Injectable이 되어있어야 함
// 이게 없으면 NestJS가 이 파일을 Injectable로 인식하지 않음 -> Controller에서 사용할 수 없음
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "secretKey",
    });
  }
  // validate 함수는 passport가 내장하는 함수
  // payload : jwt 토큰에서 추출된 정보
  // -> 즉 토큰에서 정보 다시 가져오는 로직
  // 토큰에서 꺼낸 정보는 @Req() req에 담겨있음
  // 그래서 req.user.id로 사용자 정보를 가져올 수 있음
  validate(payload: { sub: number }) {
    return { id: payload.sub };
  }
}
