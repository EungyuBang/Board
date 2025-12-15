import { PartialType } from "@nestjs/mapped-types";
import { CreatePostDto } from "./create-post.dto";

// createPostDto를 상속받지만
// 모든 필드가 optional이 되어 수정 가능
// 그래서 title, content 중 하나만 수정해도 됨
export class UpdatePostDto extends PartialType(CreatePostDto) {}
