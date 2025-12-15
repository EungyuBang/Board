import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: userId,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      this.prisma.post.count(),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
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

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
