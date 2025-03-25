import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  async validateUser(user: any): Promise<any> {
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
