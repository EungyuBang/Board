export class UserInfoDto {
  id: number;
  nickname: string;
  email: string;
  createdAt: Date;

  posts: {
    id: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
