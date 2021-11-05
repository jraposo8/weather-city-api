import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * City Dto
 */
export class CityDto {
  /**
   * City name
   */
  @IsString()
  @ApiProperty({ example: 'Lisbon' })
  city: string;
}
