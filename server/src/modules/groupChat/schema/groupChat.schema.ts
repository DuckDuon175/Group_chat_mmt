import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class GroupChatSchema extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  hostId: string;

  @Prop({ required: true })
  member: string;
}
