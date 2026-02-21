import { Controller, Post, Body, Param } from '@nestjs/common';
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
}
