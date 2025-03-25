import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('me')
  async getProfile(@Query('email') email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('User Not Found');
    return { data: user };
  }
}
