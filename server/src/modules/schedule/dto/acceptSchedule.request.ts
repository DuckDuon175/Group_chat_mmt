import { IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AcceptScheduleRequest {
  @ApiProperty({
    description: "Unique identifier for the schedule",
    example: "abcd1234-ff2e-43b0-8f78-4dcc98128a16",
  })
  @IsNotEmpty()
  @IsUUID()
  schedule_id: string;
}
