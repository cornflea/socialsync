import { ApiProperty } from '@nestjs/swagger';

export class LinkedInAccountDto {
  @ApiProperty({
    description: 'LinkedIn account ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'LinkedIn platform user ID',
    example: 'abc123def',
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

export class LinkedInAuthCallbackDto {
  @ApiProperty({
    description: 'OAuth authorization code',
    example: 'AQVRKwBZZlMKJDFHKJDFHKJSDHFKJSDHKJF...',
  })
  code: string;

  @ApiProperty({
    description: 'OAuth state parameter',
    example: 'random-state-string',
  })
  state: string;
}

export class LinkedInPostDto {
  @ApiProperty({
    description: 'Text content of the post',
    example: 'Check out this amazing article!',
  })
  text: string;

  @ApiProperty({
    description: 'Optional image URL to include',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Optional link URL to share',
    example: 'https://example.com/article',
    required: false,
  })
  linkUrl?: string;
}

export class LinkedInProfileDto {
  @ApiProperty({
    description: 'LinkedIn user ID',
    example: 'abc123def',
  })
  id: string;

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
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Profile picture URL',
    example: 'https://media.licdn.com/dms/image/...',
    required: false,
  })
  profilePicture?: string;
}
