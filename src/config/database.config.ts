import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  User,
  SocialAccount,
  Post,
  PostPublication,
  RefreshToken,
} from '../entities';

export const createTypeOrmOptions = (configService: ConfigService) => ({
  type: 'postgres' as const,
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', ''),
  database: configService.get<string>('DB_DATABASE', 'cornflea_social'),
  entities: [User, SocialAccount, Post, PostPublication, RefreshToken],
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
  logging: configService.get<boolean>('DB_LOGGING', false),
});

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'cornflea_social',
  entities: [User, SocialAccount, Post, PostPublication, RefreshToken],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DB_LOGGING === 'true',
});
