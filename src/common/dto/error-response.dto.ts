import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message or array of error messages',
    oneOf: [
      { type: 'string', example: 'Invalid credentials' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['email must be a valid email', 'password is required'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error type/code',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2023-09-13T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'API path where the error occurred',
    example: '/api/auth/login',
  })
  path: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Validation error messages',
    type: [String],
    example: [
      'email must be a valid email',
      'password must be longer than or equal to 6 characters',
    ],
  })
  message: string[];

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2023-09-13T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'API path where the error occurred',
    example: '/api/auth/register',
  })
  path: string;
}

export class UnauthorizedErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Unauthorized error message',
    example: 'Invalid credentials',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Unauthorized',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2023-09-13T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'API path where the error occurred',
    example: '/api/auth/login',
  })
  path: string;
}

export class ConflictErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 409,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Conflict error message',
    example: 'User with this email already exists',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Conflict',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2023-09-13T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'API path where the error occurred',
    example: '/api/auth/register',
  })
  path: string;
}
