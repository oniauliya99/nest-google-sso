import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { accessToken } = await this.authService.googleLogin(
      req.user,
      req.user.refreshToken,
    );
    return res.redirect(`/auth/success?token=${accessToken}`);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('success')
  success(@Req() req) {
    return req.query.token;
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  async protectedRoute(@Req() req) {
    return { message: 'You have access', user: req.user };
  }
}
