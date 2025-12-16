import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 비어있으면 comment/ 로 들어온다
  // 댓글 생성
  @UseGuards(AuthGuard("jwt"))
  @Post()
  create(@Req() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(req.user.id, createCommentDto);
  }

  // 특정 게시글의 댓글 목록 조회
  // GET /comment/post/:postId
  @Get("post/:postId")
  findAll(@Param("postId") postId: string) {
    return this.commentService.findAll(+postId);
  }

  // 댓글 수정
  @UseGuards(AuthGuard("jwt"))
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Req() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(+id, req.user.id, updateCommentDto);
  }

  // 댓글 삭제
  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  remove(@Param("id") id: string, @Req() req) {
    return this.commentService.remove(+id, req.user.id);
  }
}
