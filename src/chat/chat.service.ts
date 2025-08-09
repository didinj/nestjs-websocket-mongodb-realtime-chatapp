import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) { }

    async create(createMessageDto: CreateMessageDto) {
        const created = new this.messageModel(createMessageDto);
        return created.save();
    }

    async findLastMessages(room: string, limit = 50) {
        return this.messageModel
            .find({ room })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()
            .exec();
    }
}
