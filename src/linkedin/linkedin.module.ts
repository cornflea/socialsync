import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LinkedInController } from './linkedin.controller';
import { LinkedInService } from './linkedin.service';
import { LinkedInStrategy } from './strategies/linkedin.strategy';
import { SocialAccount, User } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([SocialAccount, User]),
    ConfigModule,
    PassportModule,
  ],
  controllers: [LinkedInController],
  providers: [LinkedInService, LinkedInStrategy],
  exports: [LinkedInService],
})
export class LinkedInModule {}
