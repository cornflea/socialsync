import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import {
  CurrentUser,
  RequestUser,
} from '../auth/decorators/current-user.decorator';
import { InstagramService } from './instagram.service';
import { InstagramPublishedMediaResponse } from './interfaces';
import {
  InstagramPostDto,
  InstagramLinkAccountRequestDto,
  InstagramOAuthCallbackResponseDto,
  InstagramLinkAccountResponseDto,
  InstagramAccountStatusResponseDto,
  InstagramProfileResponseDto,
  InstagramMediaResponseDto,
  InstagramPostResponseDto,
  InstagramUnlinkResponseDto,
} from './dto';
import {
  UnauthorizedErrorResponseDto,
  ValidationErrorResponseDto,
} from '../common/dto/error-response.dto';

interface InstagramPassportUser {
  instagramId: string;
  username: string;
  displayName: string;
  photo?: string;
  accessToken: string;
  refreshToken?: string;
}

@ApiTags('instagram')
@Controller('auth/instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @ApiOperation({
    summary: 'Initiate Instagram OAuth flow',
    description: `
Redirects the user to Instagram's OAuth authorization page to begin the authentication process.

**Flow:**
1. User clicks this endpoint
2. Redirected to Instagram for authorization
3. User grants permissions
4. Instagram redirects back to callback endpoint

**Required Instagram App Setup:**
- Valid Client ID and Secret from Facebook Developer Console
- Redirect URI configured: \`http://localhost:3000/auth/instagram/callback\`
- Permissions: instagram_basic, user_profile, user_media

**Note:** Instagram OAuth is handled through Facebook's developer platform.
    `,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Instagram OAuth authorization page',
    headers: {
      Location: {
        description: 'Instagram OAuth authorization URL',
        schema: {
          type: 'string',
          example: 'https://api.instagram.com/oauth/authorize?client_id=...',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'OAuth configuration error',
    type: ValidationErrorResponseDto,
  })
  @Get()
  @UseGuards(AuthGuard('instagram'))
  async instagramAuth(): Promise<void> {
    // This method initiates the Instagram OAuth flow
    // The actual redirect is handled by Passport
  }

  @ApiOperation({
    summary: 'Instagram OAuth callback handler',
    description: `
Handles the OAuth callback from Instagram after user authorization.

**Process:**
1. Instagram redirects here with authorization code
2. Code is exchanged for access token
3. User profile data is retrieved
4. Response contains Instagram user information

**Note:** This endpoint is automatically called by Instagram and should not be invoked directly.
The response contains Instagram user data but NOT access tokens for security reasons.
Use the \`/auth/instagram/link\` endpoint to associate the account with an authenticated user.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Instagram OAuth callback processed successfully',
    type: InstagramOAuthCallbackResponseDto,
    examples: {
      success: {
        summary: 'Successful OAuth callback',
        value: {
          success: true,
          message: 'Instagram authentication successful',
          instagramData: {
            instagramId: '17841405793187218',
            username: 'johndoe_official',
            displayName: 'John Doe',
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'OAuth callback failed - invalid code or state parameter',
    type: ValidationErrorResponseDto,
    examples: {
      invalidCode: {
        summary: 'Invalid authorization code',
        value: {
          success: false,
          message: 'Instagram authentication failed',
          error: 'Invalid authorization code',
        },
      },
    },
  })
  @Get('callback')
  @UseGuards(AuthGuard('instagram'))
  instagramAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const instagramUser = req.user as InstagramPassportUser;

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + 5184000); // 60 days default

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Instagram authentication successful',
        instagramData: {
          instagramId: instagramUser.instagramId,
          username: instagramUser.username,
          displayName: instagramUser.displayName,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Instagram authentication failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @ApiOperation({
    summary: 'Link Instagram account to authenticated user',
    description: `
Associates an Instagram account with the currently authenticated user.

**Requirements:**
- Valid JWT token in Authorization header
- Instagram account data from OAuth flow
- User must be authenticated

**Process:**
1. Verify JWT token
2. Store Instagram account credentials
3. Create social account link in database
4. Return account details

**Security Note:** Access tokens are stored securely and never returned in API responses.
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    description: 'Instagram OAuth data obtained from the OAuth flow',
    type: InstagramLinkAccountRequestDto,
    examples: {
      linkAccount: {
        summary: 'Link Instagram account',
        value: {
          instagramId: '17841405793187218',
          accessToken: 'IGQVJXYlJYcXpHVmVJa...',
          refreshToken: 'IGQVJXcFhVMGpNSXdqM...',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Instagram account linked successfully',
    type: InstagramLinkAccountResponseDto,
    examples: {
      success: {
        summary: 'Account linked successfully',
        value: {
          success: true,
          message: 'Instagram account linked successfully',
          account: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            platformUserId: '17841405793187218',
            isActive: true,
            tokenExpiresAt: '2024-03-13T10:30:00Z',
            createdAt: '2023-09-13T10:30:00Z',
            updatedAt: '2023-09-13T10:30:00Z',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid input data or Instagram account already linked to another user',
    type: ValidationErrorResponseDto,
    examples: {
      alreadyLinked: {
        summary: 'Account already linked',
        value: {
          success: false,
          message: 'Instagram account is already linked to another user',
        },
      },
      invalidToken: {
        summary: 'Invalid access token',
        value: {
          success: false,
          message: 'Invalid Instagram access token provided',
        },
      },
    },
  })
  @Post('link')
  @UseGuards(JwtAuthGuard)
  async linkAccount(
    @CurrentUser() user: RequestUser,
    @Body()
    body: {
      instagramId: string;
      accessToken: string;
      refreshToken?: string;
    },
  ) {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 5184000); // 60 days

    const account = await this.instagramService.linkInstagramAccount(
      user.userId,
      {
        instagramId: body.instagramId,
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        expiresAt,
      },
    );

    return {
      success: true,
      message: 'Instagram account linked successfully',
      account,
    };
  }

  @ApiOperation({
    summary: 'Unlink Instagram account from user',
    description: `
Removes the Instagram account association from the authenticated user.

**Effects:**
- Deactivates the social account link
- Prevents future Instagram API operations
- Preserves historical data but marks as inactive
- User will need to re-authenticate to use Instagram features again

**Note:** This does not revoke tokens on Instagram's side. Users should manually revoke 
access in their Instagram account settings for complete disconnection.
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Instagram account unlinked successfully',
    type: InstagramUnlinkResponseDto,
    examples: {
      success: {
        summary: 'Account unlinked successfully',
        value: {
          success: true,
          message: 'Instagram account unlinked successfully',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @Post('unlink')
  @UseGuards(JwtAuthGuard)
  async unlinkAccount(@CurrentUser() user: RequestUser) {
    await this.instagramService.unlinkInstagramAccount(user.userId);

    return {
      success: true,
      message: 'Instagram account unlinked successfully',
    };
  }

  @ApiOperation({
    summary: 'Check Instagram account link status',
    description: `
Retrieves the current Instagram account association status for the authenticated user.

**Returns:**
- Whether an Instagram account is currently linked
- Account details if linked (without sensitive token data)
- Useful for UI state management and conditional feature display

**Use Cases:**
- Show/hide Instagram posting features in UI
- Display account connection status
- Validate before attempting Instagram operations
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Instagram account status retrieved successfully',
    type: InstagramAccountStatusResponseDto,
    examples: {
      linked: {
        summary: 'Account is linked',
        value: {
          isLinked: true,
          account: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            platformUserId: '17841405793187218',
            isActive: true,
            tokenExpiresAt: '2024-03-13T10:30:00Z',
            createdAt: '2023-09-13T10:30:00Z',
            updatedAt: '2023-09-13T10:30:00Z',
          },
        },
      },
      notLinked: {
        summary: 'No account linked',
        value: {
          isLinked: false,
          account: null,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getAccountStatus(@CurrentUser() user: RequestUser) {
    const account = await this.instagramService.getInstagramAccount(
      user.userId,
    );

    return {
      isLinked: !!account,
      account: account || null,
    };
  }

  @ApiOperation({
    summary: 'Retrieve Instagram profile information',
    description: `
Fetches the current user's Instagram profile data using stored access tokens.

**Retrieved Data:**
- Basic profile information (ID, username)
- Account type (PERSONAL, BUSINESS, CREATOR)
- Media count

**Requirements:**
- Valid JWT authentication
- Instagram account must be linked
- Valid access token (automatically refreshed if needed)

**Rate Limits:** This endpoint is subject to Instagram API rate limits.
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Instagram profile retrieved successfully',
    type: InstagramProfileResponseDto,
    examples: {
      success: {
        summary: 'Profile retrieved successfully',
        value: {
          success: true,
          profile: {
            id: '17841405793187218',
            username: 'johndoe_official',
            account_type: 'PERSONAL',
            media_count: 142,
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Instagram account not linked or API error',
    type: ValidationErrorResponseDto,
    examples: {
      notLinked: {
        summary: 'Account not linked',
        value: {
          success: false,
          message: 'Instagram account not linked',
        },
      },
      apiError: {
        summary: 'Instagram API error',
        value: {
          success: false,
          message: 'Failed to fetch Instagram profile',
          error: 'Invalid or expired access token',
        },
      },
    },
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: RequestUser) {
    const account = await this.instagramService.getInstagramAccount(
      user.userId,
    );
    if (!account) {
      return {
        success: false,
        message: 'Instagram account not linked',
      };
    }

    const profile = await this.instagramService.getInstagramProfile(
      account.accessToken,
    );

    return {
      success: true,
      profile,
    };
  }

  @ApiOperation({
    summary: 'Retrieve Instagram media',
    description: `
Fetches the user's Instagram media posts using stored access tokens.

**Retrieved Data:**
- Media posts (images, videos, carousel albums)
- Media URLs and thumbnails
- Captions and timestamps
- Permalinks to Instagram posts

**Query Parameters:**
- \`limit\`: Number of media items to retrieve (default: 25, max: 100)

**Requirements:**
- Valid JWT authentication
- Instagram account must be linked
- Valid access token with user_media scope

**Rate Limits:** Subject to Instagram Basic Display API limits.
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiQuery({
    name: 'limit',
    description: 'Number of media items to retrieve',
    required: false,
    type: 'number',
    example: 25,
  })
  @ApiResponse({
    status: 200,
    description: 'Instagram media retrieved successfully',
    type: InstagramMediaResponseDto,
    examples: {
      success: {
        summary: 'Media retrieved successfully',
        value: {
          success: true,
          media: [
            {
              id: '17841405793187218',
              media_type: 'IMAGE',
              media_url: 'https://scontent.cdninstagram.com/v/t51.2885-15/...',
              permalink: 'https://www.instagram.com/p/ABC123/',
              caption: 'Amazing sunset today! 🌅',
              timestamp: '2023-09-13T10:30:00Z',
              username: 'johndoe_official',
            },
          ],
          paging: {
            next: 'https://graph.instagram.com/me/media?after=...',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Instagram account not linked or API error',
    type: ValidationErrorResponseDto,
  })
  @Get('media')
  @UseGuards(JwtAuthGuard)
  async getMedia(
    @CurrentUser() user: RequestUser,
    @Query('limit') limit?: number,
  ) {
    const account = await this.instagramService.getInstagramAccount(
      user.userId,
    );
    if (!account) {
      return {
        success: false,
        message: 'Instagram account not linked',
      };
    }

    const mediaResponse = await this.instagramService.getInstagramMedia(
      account.accessToken,
      limit || 25,
    );

    return {
      success: true,
      media: mediaResponse.data,
      paging: mediaResponse.paging,
    };
  }

  @ApiOperation({
    summary: 'Post content to Instagram',
    description: `
Publishes content to the user's Instagram profile using the Instagram Basic Display API.

**Supported Content Types:**
- Single images (IMAGE)
- Single videos (VIDEO)
- Carousel albums with multiple images/videos (CAROUSEL_ALBUM)

**Requirements:**
- Valid JWT authentication
- Instagram account must be linked with content creation permissions
- Valid access token with user_media scope
- Media files must be publicly accessible URLs

**Publishing Process:**
1. Create media object with Instagram API
2. Publish the media object
3. Return published media ID

**Rate Limits:** Subject to Instagram API publishing limits.

**Content Guidelines:** Posts must comply with Instagram's content policies and community standards.
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    type: InstagramPostDto,
    description: 'Content to post to Instagram',
    examples: {
      image: {
        summary: 'Single image post',
        value: {
          media_type: 'IMAGE',
          image_url: 'https://example.com/image.jpg',
          caption: 'Check out this amazing sunset! 🌅',
        },
      },
      video: {
        summary: 'Single video post',
        value: {
          media_type: 'VIDEO',
          video_url: 'https://example.com/video.mp4',
          caption: 'Time-lapse of the city skyline 🏙️',
        },
      },
      carousel: {
        summary: 'Carousel album post',
        value: {
          media_type: 'CAROUSEL_ALBUM',
          caption: 'A collection of beautiful moments',
          children: [
            {
              media_type: 'IMAGE',
              media_url: 'https://example.com/image1.jpg',
            },
            {
              media_type: 'IMAGE',
              media_url: 'https://example.com/image2.jpg',
            },
            {
              media_type: 'VIDEO',
              media_url: 'https://example.com/video.mp4',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Content posted to Instagram successfully',
    type: InstagramPostResponseDto,
    examples: {
      success: {
        summary: 'Post published successfully',
        value: {
          success: true,
          message: 'Content posted to Instagram successfully',
          mediaId: '17841405793187218',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Instagram account not linked, invalid content, or posting failed',
    type: ValidationErrorResponseDto,
    examples: {
      notLinked: {
        summary: 'Account not linked',
        value: {
          success: false,
          message: 'Instagram account not linked',
        },
      },
      postingFailed: {
        summary: 'Posting failed',
        value: {
          success: false,
          message: 'Failed to post to Instagram',
          error: 'Invalid media URL or content violates policies',
        },
      },
      rateLimited: {
        summary: 'Rate limit exceeded',
        value: {
          success: false,
          message: 'Failed to post to Instagram',
          error: 'Rate limit exceeded - try again later',
        },
      },
    },
  })
  @Post('post')
  @UseGuards(JwtAuthGuard)
  async postToInstagram(
    @CurrentUser() user: RequestUser,
    @Body() postData: InstagramPostDto,
  ) {
    const result: InstagramPublishedMediaResponse =
      await this.instagramService.postToInstagram(user.userId, postData);

    return {
      success: true,
      message: 'Content posted to Instagram successfully',
      mediaId: result.id,
    };
  }
}
