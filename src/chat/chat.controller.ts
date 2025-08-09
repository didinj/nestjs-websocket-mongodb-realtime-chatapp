import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('history')
    async history(@Query('room') room: string, @Query('limit') limit?: string) {
        const l = limit ? parseInt(limit, 10) : 50;
        const msgs = await this.chatService.findLastMessages(room, l);
        return msgs.reverse();
    }
}
