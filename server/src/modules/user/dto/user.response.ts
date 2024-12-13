import { Expose, Exclude } from "class-transformer";

@Exclude()
export class UserResponse {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  password?: string;

  @Expose()
  gender?: number;

  @Expose()
  birth?: bigint;

  @Expose()
  phone_number?: string;

  @Expose()
  information?: string;
}
