import { ApiProperty } from '@nestjs/swagger';
import { LinkedInAccountDto, LinkedInProfileDto } from './linkedin.dto';

export class LinkedInOAuthInitiateResponseDto {
  @ApiProperty({
    description: 'Redirect URL to LinkedIn OAuth authorization page',
    example: 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=...',
  })
  redirectUrl: string;

  @ApiProperty({
    description: 'OAuth state parameter for security',
    example: 'random-state-string-12345',
  })
  state: string;
}

export class LinkedInOAuthCallbackResponseDto {
  @ApiProperty({
    description: 'Whether the OAuth callback was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'LinkedIn authentication successful',
  })
  message: string;

  @ApiProperty({
    description: 'LinkedIn user data returned from OAuth',
    type: 'object',
    properties: {
      linkedInId: {
        type: 'string',
        description: 'LinkedIn user ID',
        example: 'abc123def456',
      },
      displayName: {
        type: 'string',
        description: 'User display name',
        example: 'John Doe',
      },
      email: {
        type: 'string',
        description: 'User email address',
        example: 'john.doe@example.com',
      },
    },
  })
  linkedInData: {
    linkedInId: string;
    displayName: string;
    email: string;
  };
}

export class LinkedInLinkAccountRequestDto {
  @ApiProperty({
    description: 'LinkedIn user ID obtained from OAuth',
    example: 'abc123def456',
  })
  linkedInId: string;

  @ApiProperty({
    description: 'Access token obtained from LinkedIn OAuth',
    example: 'AQVlKw...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token obtained from LinkedIn OAuth (optional)',
    example: 'AQVlKw...',
    required: false,
  })
  refreshToken?: string;
}

export class LinkedInLinkAccountResponseDto {
  @ApiProperty({
    description: 'Whether the account linking was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'LinkedIn account linked successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Created or updated LinkedIn account information',
    type: LinkedInAccountDto,
  })
  account: LinkedInAccountDto;
}

export class LinkedInAccountStatusResponseDto {
  @ApiProperty({
    description: 'Whether a LinkedIn account is linked to the user',
    example: true,
  })
  isLinked: boolean;

  @ApiProperty({
    description: 'LinkedIn account details if linked',
    type: LinkedInAccountDto,
    nullable: true,
  })
  account: LinkedInAccountDto | null;
}

export class LinkedInProfileResponseDto {
  @ApiProperty({
    description: 'Whether the profile retrieval was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'LinkedIn profile information',
    type: LinkedInProfileDto,
  })
  profile: LinkedInProfileDto;
}

export class LinkedInPostResponseDto {
  @ApiProperty({
    description: 'Whether the post was successfully published',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Content posted to LinkedIn successfully',
  })
  message: string;

  @ApiProperty({
    description: 'LinkedIn post ID',
    example: 'urn:li:share:12345678901234567890',
  })
  postId: string;
}

export class LinkedInUnlinkResponseDto {
  @ApiProperty({
    description: 'Whether the account unlinking was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'LinkedIn account unlinked successfully',
  })
  message: string;
}

export class LinkedInErrorResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Error message',
    example: 'LinkedIn account not linked',
  })
  message: string;

  @ApiProperty({
    description: 'Detailed error information',
    example: 'User has not linked their LinkedIn account',
    required: false,
  })
  error?: string;
}
