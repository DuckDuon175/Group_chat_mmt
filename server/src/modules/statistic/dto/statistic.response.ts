import { Expose, Exclude } from "class-transformer";

@Exclude()
export class StatisticResponse {
  @Expose()
  doctor_array: number;

  @Expose()
  patient_array: number;

  @Expose()
  device_array: any;

  @Expose()
  record_array: any;
}
