import { IsNotEmpty, IsUUID, IsString, IsInt, IsOptional, IsUrl, IsPhoneNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRequest {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'f4289c39-ff2e-43b0-8f78-4dcc98128a16',
  })
  @IsNotEmpty()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'Account ID associated with the user',
    example: 'f4289c39-ff2e-43b0-8f78-4dcc98128a16',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Account ID associated with the user',
    example: 'f4289c39-ff2e-43b0-8f78-4dcc98128a16',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Username for the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Gender of the user, represented by an integer (e.g., 0 for male, 1 for female)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  gender?: number;

  @ApiProperty({
    description: 'Birth date of the user in ISO format',
    example: '1990-01-01T00:00:00',
  })
  @IsOptional()
  @IsDateString()
  birth?: bigint;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+84901234567',
  })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone_number?: string;

  @ApiProperty({
    description: 'Additional information about the user',
    example: 'Some bio or information about the user',
  })
  @IsOptional()
  @IsString()
  information?: string;
}
