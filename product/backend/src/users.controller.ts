import { Controller,Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('analyze')
@UseInterceptors(FileInterceptor('file'))
async analyzeEmotion(
  @UploadedFile() file: Express.Multer.File,
  @Body('senderId') senderId: string,
  @Body('receiverId') receiverId: string,
) {
  const result = await this.usersService.analyzeEmotion(
    file,
    senderId,
    receiverId
  );
  return result;
}

  @Get('test-insert')
    async testInsert() {
        return this.usersService.testInsert();
    }
}