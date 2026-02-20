import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeEmotion(@UploadedFile() file: Express.Multer.File) {
    // NestJSサービスにファイルを渡して emotion-api 呼び出し
    const result = await this.usersService.analyzeEmotion(file);
    return result;
  }
}