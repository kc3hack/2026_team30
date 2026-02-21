import { Controller,Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
async login(
  @Body('name') name: string,
  @Body('password') password: string,
) {
  const result = await this.authService.login(
    name,
    password
  );
  return result;
}
}