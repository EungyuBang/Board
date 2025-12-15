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

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.commentService.findOne(+id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Req() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(+id, req.user.id, updateCommentDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  remove(@Param("id") id: string, @Req() req) {
    return this.commentService.remove(+id, req.user.id);
  }
}
