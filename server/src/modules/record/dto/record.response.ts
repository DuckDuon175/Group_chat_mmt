import { Expose, Exclude } from "class-transformer";

@Exclude()
export class RecordResponse {
  @Expose()
  id: string;

  @Expose()
  patient_id: string;

  @Expose()
  doctor?: string;

  @Expose()
  patient?: string;

  @Expose()
  device_id: string;

  @Expose()
  device_name?: string;

  @Expose()
  schedule_id: string;

  @Expose()
  start_time: bigint;

  @Expose()
  end_time: bigint;

  @Expose()
  data_rec_url: string;
}
