import { Exclude, Expose } from "class-transformer";

@Exclude()
export class NotificationResponse {
  @Expose()
  id: string;

  @Expose()
  patient_id: string;

  @Expose()
  patient_name?: string;

  @Expose()
  doctor_id: string;

  @Expose()
  doctor_name?: string;

  @Expose()
  schedule_start_time: bigint;

  @Expose()
  is_seen: boolean;

  @Expose()
  type: number;

  @Expose()
  status: number;

  @Expose()
  createdAt: Date;
}
