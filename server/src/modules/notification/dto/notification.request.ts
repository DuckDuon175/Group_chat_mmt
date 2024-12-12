import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class NotificationRequest {
  @ApiProperty({
    description: "The unique identifier for the schedule notification",
    example: "987e6543-a21b-23d5-f456-5566b87741233",
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "The unique identifier for the user with role doctor",
    example: "f4289c39-ff2e-43b0-8f78-4dcc98128a16",
  })
  @IsNotEmpty()
  @IsUUID()
  doctor_id: string;

  @ApiProperty({
    description: "The unique identifier for the user with role patient",
    example: "f4289c39-ff2e-43b0-8f78-4dcc98128a16",
  })
  @IsNotEmpty()
  @IsUUID()
  patient_id: string;

  @ApiProperty({
    description: "Start time of the schedule",
    example: "20241003092312",
  })
  @IsNotEmpty()
  schedule_start_time: bigint;

  @ApiProperty({
    description:
      "Check if the notification was seen before (true: seen, false: not seen)",
    example: false,
  })
  @IsNotEmpty()
  is_seen: boolean;

  @ApiProperty({
    description:
      "Status of the schedule (1: accepted, 2:pending (if send to doctor) or successful follow-up schedule, 3: rejected)",
    example: 0,
  })
  @IsNotEmpty()
  status: number;

  @ApiProperty({
    description: "Type of the schedule (0: Send to Patient, 1: Send to Doctor)",
    example: 1,
  })
  @IsNotEmpty()
  type: number;
}
