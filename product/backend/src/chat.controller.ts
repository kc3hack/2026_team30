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
  async saveTextMessage(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
    @Body('text') text: string,
    @Body('textColor') textColor: string,
    @Body('textSize') textSize: number
  ){
    return this.chatService.saveTextMessage(senderId, receiverId, text, textColor, textSize);
  }
}
