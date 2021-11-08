import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiGoneResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiRequestTimeoutResponse,
} from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppService } from './app.service';
import { CityWeatherResponseDto } from './dtos/city-weather-response.dto';
import { CityDto } from './dtos/city.dto';
import { Logger } from 'winston';

@Controller('v1/weather-api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @ApiOperation({
    summary: 'Ping',
    description: 'Performs a readiness health check at the service.',
  })
  @ApiOkResponse({ description: 'Service is up and running.' })
  @ApiBadRequestResponse({ description: 'Errors in params.' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong during the request.',
  })
  @ApiGoneResponse({
    description:
      'The resource requested is no longer available and will not be available again.',
  })
  @ApiRequestTimeoutResponse({ description: 'Request timeout.' })
  @Get('ping')
  ping(): string {
    return 'Service up and running';
  }

  @Get(':city')
  async getCityWeather(
    @Param() cityDto: CityDto,
  ): Promise<CityWeatherResponseDto> {
    this.logger.info('getCityWeather()', {
      controller: AppController.name,
    });

    return await this.appService.getCityWeather(cityDto);
  }
}
