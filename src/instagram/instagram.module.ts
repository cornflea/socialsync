import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { InstagramController } from './instagram.controller';
import { InstagramService } from './instagram.service';
import { InstagramStrategy } from './strategies/instagram.strategy';
import { SocialAccount } from '../entities/social-account.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocialAccount, User]), PassportModule],
  controllers: [InstagramController],
  providers: [InstagramService, InstagramStrategy],
  exports: [InstagramService],
})
export class InstagramModule {}
