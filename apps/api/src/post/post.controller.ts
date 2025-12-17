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
  Query,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post()
  create(@Req() req, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user.id, createPostDto);
  }

  @Get()
  findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5",
  ) {
    return this.postService.findAll(+page, +limit);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postService.findOne(+id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Req() req,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    // + -> number로 변환
    return this.postService.update(+id, +req.user.id, updatePostDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  remove(@Param("id") id: string, @Req() req) {
    return this.postService.remove(+id, +req.user.id);
  }
}
