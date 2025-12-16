import { PartialType } from "@nestjs/mapped-types";
import { UserInfoDto } from "./userinfo.dto";

export class UpdateUserDto extends PartialType(UserInfoDto) {}
