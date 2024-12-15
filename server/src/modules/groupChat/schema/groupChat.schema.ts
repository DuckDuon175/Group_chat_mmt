import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class GroupChatSchema extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  hostId: string;

  @Prop({ required: true })
  member: [string];

  @Prop({ required: true })
  sendEvent: string;

  @Prop({ required: true })
  receiveEvent: string;
}

export const GroupMessageSchema = SchemaFactory.createForClass(GroupChatSchema);