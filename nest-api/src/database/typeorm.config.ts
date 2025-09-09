import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

//Database configuration from .env file
const configService = new ConfigService();

export const typeOrmConfig: TypeOrmModuleOptions = {

  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  timezone: configService.get<string>('DB_TIMEZONE') ?? '-03:00',
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
  ],
  synchronize: true,
}