import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 1,
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 1,
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
    format: 'password',
  })
  @MinLength(6)
  password: string;
}
