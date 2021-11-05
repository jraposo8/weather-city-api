import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CityWeatherResponseDto } from './dtos/city-weather-response.dto';
import { HttpService } from '@nestjs/axios';
import { CityDto } from './dtos/city.dto';
import { firstValueFrom } from 'rxjs';
import { IOpenWeather } from './models/open-weather.interface';
import { AxiosRequestConfig } from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AppService {
  // multiply timespan by 1000 since TS/JS timestamps are in milliseconds
  readonly MULTIPLY = 1000;

  constructor(
    private httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getCityWeather({ city }: CityDto): Promise<CityWeatherResponseDto> {
    this.logger.info('getCityWeather()', {
      service: AppService.name,
    });

    let response;

    try {
      response = await firstValueFrom(
        this.httpService.get<IOpenWeather>(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=a817d8111ac27ae28ffc2c6a3d970e92`,
          this.getHttpRequestsConfigurations(),
        ),
      );
    } catch (error) {
      this.logger.error({
        service: AppService.name,
        status: `${response.status}`,
        message: `Error sending HTTP request. Error message: ${error.message}`,
      });
    }

    switch (response.status) {
      case 200:
        this.logger.info('httpService', {
          service: AppService.name,
          status: `${response.status}`,
        });
        return this.parseWeatherData(response.data);
      case 404:
        this.logger.error({
          service: AppService.name,
          status: `${response.status}`,
          message: `City ${city} not found`,
        });
        throw new NotFoundException(`City ${city} not found`);
      default:
        this.logger.error({
          service: AppService.name,
          status: `${response.status}`,
          message: `The open weather map api returned an unexpected response status`,
        });
        throw new InternalServerErrorException();
    }
  }

  parseWeatherData({ main, sys }: IOpenWeather): CityWeatherResponseDto {
    return {
      temperature: main?.temp,
      sunrise: new Date(sys?.sunrise * this.MULTIPLY).toISOString(),
      sunset: new Date(sys?.sunset * this.MULTIPLY).toISOString(),
    };
  }

  getHttpRequestsConfigurations(): AxiosRequestConfig {
    return {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      maxRedirects: 5,
      validateStatus: null,
    } as AxiosRequestConfig;
  }
}
