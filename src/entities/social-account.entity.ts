import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum SocialPlatform {
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
}

@Entity('social_accounts')
export class SocialAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.socialAccounts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: SocialPlatform,
  })
  platform: SocialPlatform;

  @Column({ name: 'platform_user_id' })
  platformUserId: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @Column({ name: 'token_expires_at', nullable: true })
  tokenExpiresAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
