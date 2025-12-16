import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  // 댓글 작성
  async create(userId: number, createCommentDto: CreateCommentDto) {
    return await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        postId: createCommentDto.postId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            nickname: true,
          },
        },
      },
    });
  }

  // 특정 게시글의 댓글 조회
  async findAll(postId: number) {
    return await this.prisma.comment.findMany({
      where: { postId },
      orderBy: {
        createdAt: "desc", // 최신순 정렬
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  }

  // 댓글 수정 (본인 확인 필요)
  async update(id: number, userId: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new Error("댓글이 없습니다.");
    if (comment.authorId !== userId)
      throw new UnauthorizedException("권한이 없습니다.");

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  // 댓글 삭제 (본인 확인 필요)
  async remove(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new Error("댓글이 없습니다.");
    if (comment.authorId !== userId)
      throw new UnauthorizedException("권한이 없습니다.");

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
