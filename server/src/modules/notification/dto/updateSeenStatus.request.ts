import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateSeenStatusRequest {
  @ApiProperty({
    description: "The unique identifier for the schedule notification",
    example: "987e6543-a21b-23d5-f456-5566b87741233",
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
