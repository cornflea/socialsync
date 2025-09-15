import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token (expires in 5 minutes)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token (one-time use, lives forever until used)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Access token expiration time in seconds',
    example: 300,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: 'User information',
    type: () => User,
  })
  user: User;
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'New JWT access token (expires in 5 minutes)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'New refresh token (one-time use, lives forever until used)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Access token expiration time in seconds',
    example: 300,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  tokenType: string;
}

export class UserProfileResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  isActive: boolean;

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
