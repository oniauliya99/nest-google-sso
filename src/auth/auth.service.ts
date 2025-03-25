import { Injectable } from '@nestjs/common';
import { AuthType } from './dto/global.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateUser(authData: AuthType) {
    const { email, name, picture, accessToken } = authData;

    const user = await this.prismaService.user.upsert({
      where: { email },
      create: {
        email,
        name,
        picture,
        accessToken,
      },
      update: {
        email,
        name,
        picture,
        accessToken,
      },
    });
    return user;
  }

  async googleLogin(user: any) {
    if (!user) {
      return { message: 'No user from Google' };
    }
    return {
      message: 'User authenticated',
      user,
    };
  }
}
