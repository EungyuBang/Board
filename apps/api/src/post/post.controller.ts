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
    @Query("limit") limit: string = "10",
  ) {
    return this.postService.findAll(+page, +limit);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.postService.remove(+id);
  }
}
