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
  async refreshToken(@Body() body) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Get('success')
  success(@Req() req) {
    return req.query.token;
  }
}
