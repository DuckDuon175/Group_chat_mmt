import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MessageSchema extends Document {
  @Prop({ required: true })
  senderId: string;

  @Prop()
  groupChatId: string;

  @Prop()
  receiverId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: () => Date.now() })
  time: number;
} 

export const ChatSchema = SchemaFactory.createForClass(MessageSchema);