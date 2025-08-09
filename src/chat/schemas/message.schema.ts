import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    room: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
