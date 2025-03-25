import {
  Controller,
  Get,
  NotFoundException,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly prismaService: PrismaService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req) {
    // console.log(email, 'emailllll');
    // const user = await this.prismaService.user.findUnique({
    //   where: { email },
    // });
    // if (!user) throw new NotFoundException('User Not Found');
    // return { data: user };
    return { data: req.user };
  }
}
