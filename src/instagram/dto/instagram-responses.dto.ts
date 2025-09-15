import { ApiProperty } from '@nestjs/swagger';
import {
  InstagramAccountDto,
  InstagramProfileDto,
  InstagramMediaDto,
} from './instagram.dto';

export class InstagramOAuthCallbackResponseDto {
  @ApiProperty({
    description: 'Whether the OAuth callback was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Instagram authentication successful',
  })
  message: string;

  @ApiProperty({
    description: 'Instagram user data returned from OAuth',
    type: 'object',
    properties: {
      instagramId: {
        type: 'string',
        description: 'Instagram user ID',
        example: '17841405793187218',
      },
      username: {
        type: 'string',
        description: 'Instagram username',
        example: 'johndoe_official',
      },
      displayName: {
        type: 'string',
        description: 'User display name',
        example: 'John Doe',
      },
    },
  })
  instagramData: {
    instagramId: string;
    username: string;
    displayName: string;
  };
}

export class InstagramLinkAccountResponseDto {
  @ApiProperty({
    description: 'Whether the account linking was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Instagram account linked successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Created or updated Instagram account information',
    type: InstagramAccountDto,
  })
  account: InstagramAccountDto;
}

export class InstagramAccountStatusResponseDto {
  @ApiProperty({
    description: 'Whether an Instagram account is linked to the user',
    example: true,
  })
  isLinked: boolean;

  @ApiProperty({
    description: 'Instagram account details if linked',
    type: InstagramAccountDto,
    nullable: true,
  })
  account: InstagramAccountDto | null;
}

export class InstagramProfileResponseDto {
  @ApiProperty({
    description: 'Whether the profile retrieval was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Instagram profile information',
    type: InstagramProfileDto,
  })
  profile: InstagramProfileDto;
}

export class InstagramMediaResponseDto {
  @ApiProperty({
    description: 'Whether the media retrieval was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Array of Instagram media',
    type: [InstagramMediaDto],
  })
  media: InstagramMediaDto[];

  @ApiProperty({
    description: 'Pagination information',
    type: 'object',
    properties: {
      next: { type: 'string', nullable: true },
    },
  })
  paging?: {
    next?: string;
  };
}

export class InstagramPostResponseDto {
  @ApiProperty({
    description: 'Whether the post was successfully published',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Content posted to Instagram successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Instagram media ID',
    example: '17841405793187218',
  })
  mediaId: string;
}

export class InstagramUnlinkResponseDto {
  @ApiProperty({
    description: 'Whether the account unlinking was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Instagram account unlinked successfully',
  })
  message: string;
}

export class InstagramErrorResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Error message',
    example: 'Instagram account not linked',
  })
  message: string;

  @ApiProperty({
    description: 'Detailed error information',
    example: 'User has not linked their Instagram account',
    required: false,
  })
  error?: string;
}
