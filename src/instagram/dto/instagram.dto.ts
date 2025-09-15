import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';

export class InstagramAccountDto {
  @ApiProperty({
    description: 'Instagram account ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Instagram platform user ID',
    example: '17841405793187218',
  })
  platformUserId: string;

  @ApiProperty({
    description: 'Whether the account is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Token expiration date',
    example: '2023-12-13T10:30:00Z',
    required: false,
  })
  tokenExpiresAt?: Date;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2023-09-13T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last account update timestamp',
    example: '2023-09-13T10:30:00Z',
  })
  updatedAt: Date;
}

export class InstagramProfileDto {
  @ApiProperty({
    description: 'Instagram user ID',
    example: '17841405793187218',
  })
  id: string;

  @ApiProperty({
    description: 'Instagram username',
    example: 'johndoe_official',
  })
  username: string;

  @ApiProperty({
    description: 'Account type',
    example: 'PERSONAL',
    enum: ['PERSONAL', 'BUSINESS', 'CREATOR'],
  })
  account_type: 'PERSONAL' | 'BUSINESS' | 'CREATOR';

  @ApiProperty({
    description: 'Number of media posts',
    example: 142,
    required: false,
  })
  media_count?: number;
}

export class InstagramPostDto {
  @ApiProperty({
    description: 'Post caption',
    example: 'Check out this amazing sunset! 🌅',
    required: false,
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({
    description: 'Media type',
    example: 'IMAGE',
    enum: ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'],
  })
  @IsEnum(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'])
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

  @ApiProperty({
    description: 'Image URL for IMAGE posts',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({
    description: 'Video URL for VIDEO posts',
    example: 'https://example.com/video.mp4',
    required: false,
  })
  @IsOptional()
  @IsString()
  video_url?: string;

  @ApiProperty({
    description: 'Array of media for CAROUSEL_ALBUM posts',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        media_type: { type: 'string', enum: ['IMAGE', 'VIDEO'] },
        media_url: { type: 'string' },
      },
    },
    required: false,
  })
  @IsOptional()
  @IsArray()
  children?: Array<{
    media_type: 'IMAGE' | 'VIDEO';
    media_url: string;
  }>;
}

export class InstagramLinkAccountRequestDto {
  @ApiProperty({
    description: 'Instagram user ID obtained from OAuth',
    example: '17841405793187218',
  })
  @IsString()
  @IsNotEmpty()
  instagramId: string;

  @ApiProperty({
    description: 'Access token obtained from Instagram OAuth',
    example: 'IGQVJXYlJYcXpHVmVJa...',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token obtained from Instagram OAuth (optional)',
    example: 'IGQVJXcFhVMGpNSXdqM...',
    required: false,
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class InstagramMediaDto {
  @ApiProperty({
    description: 'Media ID',
    example: '17841405793187218',
  })
  id: string;

  @ApiProperty({
    description: 'Media type',
    example: 'IMAGE',
    enum: ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'],
  })
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

  @ApiProperty({
    description: 'Media URL',
    example: 'https://scontent.cdninstagram.com/v/t51.2885-15/...',
  })
  media_url: string;

  @ApiProperty({
    description: 'Media permalink',
    example: 'https://www.instagram.com/p/ABC123/',
  })
  permalink: string;

  @ApiProperty({
    description: 'Thumbnail URL for videos',
    example: 'https://scontent.cdninstagram.com/v/t51.2885-15/...',
    required: false,
  })
  thumbnail_url?: string;

  @ApiProperty({
    description: 'Media caption',
    example: 'Amazing sunset today! 🌅',
    required: false,
  })
  caption?: string;

  @ApiProperty({
    description: 'Media timestamp',
    example: '2023-09-13T10:30:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Username of the media owner',
    example: 'johndoe_official',
  })
  username: string;
}
