import { ApiProperty } from '@nestjs/swagger';

/**
 * City Dto
 */
export class CityWeatherResponseDto {
  /**
   * Current Temperature
   */
  @ApiProperty({ example: '33' })
  temperature: number;

  /**
   * Sunrise (ISO format, in UTC)
   */
  @ApiProperty({ example: '2021-11-04T07:59:59.000Z' })
  sunrise: string;

  /**
   * Sunset (ISO format, in UTC)
   */
  @ApiProperty({ example: '2021-11-04T17:59:59.000Z' })
  sunset: string;
}
