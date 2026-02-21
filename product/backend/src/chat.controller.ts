import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('room')
  async getHistory(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
  ) {
    const result = await this.chatService.getRoomHistory(
      senderId,
      receiverId
    );
    return result;
  }

  @Post('text')
  async saveTextMessage(@Body() body:any){
    return this.chatService.saveTextMessage(body);
  }
}
