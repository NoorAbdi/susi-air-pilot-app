import { IsString, IsNotEmpty } from 'class-validator';

export class GetFlightHoursDto {
  @IsString()
  @IsNotEmpty()
  from!: string;

  @IsString()
  @IsNotEmpty()
  to!: string;
}