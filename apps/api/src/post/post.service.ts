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
    // 1. 건너뛸 개수 계산 (Offset 계산)
    // 1페이지면 0개를 건너뛰고 (처음부터)
    // 2페이지면 10개를 건너뛰어야 함 (11번부터 보여줌)
    const skip = (page - 1) * limit;

    // 2. 병렬 처리 (두 가지 DB 작업을 동시에!)
    // posts: 게시글 데이터 가져오기
    // total: 전체 게시글 개수 세기 (페이지 번호 만들려고)
    const [posts, total] = await Promise.all([
      // 게시글 목록 조회
      this.prisma.post.findMany({
        skip, // 앞에서 몇 개 건너뛰고
        take: limit, // 몇 개 가져올래? (10개)
        orderBy: { createdAt: "desc" }, // 최신순 정렬

        // 관계된 데이터 같이 가져오기 (JOIN)
        include: {
          // 작성자 정보도 줘
          author: {
            // 근데 다 주지 말고
            select: {
              id: true, // 아이디랑
              nickname: true, // 닉네임만 줘 (비번은 절대 안됨!)
            },
          },
          _count: {
            // 댓글 내용 말고 '개수'만 세어서 줘
            select: {
              comments: true,
            },
          },
        },
      }),

      // 전체 개수 조회
      this.prisma.post.count(),
    ]);

    // 최종 응답 포장 (DTO 느낌)
    return {
      data: posts, // 실제 게시글 리스트
      meta: {
        // 프론트에서 페이지네이션 버튼 만들 때 필요한 정보
        total, // 전체 글 개수 (예: 123개)
        page, // 현재 페이지 (예: 1)
        limit, // 한 페이지당 개수 (예: 10)
        totalPages: Math.ceil(total / limit), // 총 페이지 수 (123 / 10 = 12.3 -> 올림해서 13페이지)
      },
    };
  }

  // 특정 게시글 조회
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

  // 게시글 수정
  async update(id: number, userId: number, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error("게시글을 찾을 수 없습니다.");
    if (post.authorId !== userId) throw new Error("수정 권한이 없습니다.");

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  // 게시글 삭제
  async remove(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new Error("게시글을 찾을 수 없습니다.");
    if (post.authorId !== userId) throw new Error("삭제 권한이 없습니다.");

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
