import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':roomId')
  async getHistory(@Param('roomId') roomId: string) {
    return this.chatService.getRoomHistory(Number(roomId));
  }
}
