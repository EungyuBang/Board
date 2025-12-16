import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch("/me")
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+req.user.id, updateUserDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("me")
  removeMe(@Req() req) {
    return this.usersService.remove(req.user.id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
