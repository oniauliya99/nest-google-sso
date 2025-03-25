import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthType } from './dto/global.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async googleLogin(profile: any, refreshToken: string) {
    if (!profile) throw new UnauthorizedException('Google login failed');

    const user = await this.prismaService.user.upsert({
      where: { email: profile.email },
      update: {
        name: profile.name,
        picture: profile.picture,
      },
      create: {
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      },
    });

    await this.prismaService.oAuthSession.upsert({
      where: { userId: user.id },
      update: {
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }, // Expire dalam 30 hari
      create: {
        userId: user.id,
        provider: 'google',
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = this.jwtService.sign({
      userId: user.id,
      email: user.email,
    });

    return { accessToken };
  }

  async generateAccessToken(userId: string, email: string) {
    return this.jwtService.sign({ userId, email });
  }

  async refreshToken(refreshToken: string) {
    const session = await this.prismaService.oAuthSession.findFirst({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || new Date(session.expiresAt) < new Date()) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }

    const newAccessToken = this.jwtService.sign({
      userId: session.user.id,
      email: session.user.email,
    });

    return { accessToken: newAccessToken };
  }

  async validateUser(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return await this.prismaService.user.findUnique({
        where: { id: decoded.userId },
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
