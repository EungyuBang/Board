export interface User {
  id: number;
  nickname?: string;
  email?: string;
  createdAt?: string;
  username?: string;
  posts?: {
    id: number;
    title: string;
    createdAt: string;
    updatedAt?: string;
  }[];
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  authorId: number;
  author?: User;
  postId: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  authorId: number;
  author?: User;
  _count?: {
    comments: number;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
