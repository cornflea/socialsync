import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('refresh_tokens')
@Index(['token'])
export class RefreshToken {
  @ApiProperty({
    description: 'Unique identifier for the refresh token',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The refresh token string',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Column({ unique: true })
  token: string;

  @ApiHideProperty()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'User ID who owns this refresh token',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty({
    description: 'Whether the token has been used (one-time use)',
    example: false,
  })
  @Column({ default: false })
  isUsed: boolean;

  @ApiProperty({
    description: 'Whether the token has been revoked',
    example: false,
  })
  @Column({ default: false })
  isRevoked: boolean;

  @ApiProperty({
    description: 'IP address when token was created',
    example: '192.168.1.1',
    required: false,
  })
  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent when token was created',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
  })
  @Column({ name: 'user_agent', nullable: true, type: 'text' })
  userAgent?: string;

  @ApiProperty({
    description: 'Token creation timestamp',
    example: '2023-09-13T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Token usage timestamp',
    example: '2023-09-13T10:35:00Z',
    required: false,
  })
  @Column({ name: 'used_at', nullable: true })
  usedAt?: Date;

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: '2023-10-13T10:30:00Z',
  })
  @Column({ name: 'expires_at' })
  expiresAt: Date;
}
