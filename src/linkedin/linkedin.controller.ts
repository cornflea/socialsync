import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  CurrentUser,
  RequestUser,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import {
  UnauthorizedErrorResponseDto,
  ValidationErrorResponseDto,
} from '../common/dto/error-response.dto';
import {
  LinkedInAccountStatusResponseDto,
  LinkedInLinkAccountRequestDto,
  LinkedInLinkAccountResponseDto,
  LinkedInOAuthCallbackResponseDto,
  LinkedInPostDto,
  LinkedInPostResponseDto,
  LinkedInProfileResponseDto,
  LinkedInUnlinkResponseDto,
} from './dto';
import { LinkedInService } from './linkedin.service';

@ApiTags('linkedin')
@Controller('auth/linkedin')
export class LinkedInController {
  constructor(private readonly linkedInService: LinkedInService) {}

  @ApiOperation({
    summary: 'Initiate LinkedIn OAuth flow',
    description: `
Redirects the user to LinkedIn's OAuth authorization page to begin the authentication process.

**Flow:**
1. User clicks this endpoint
2. Redirected to LinkedIn for authorization
3. User grants permissions
4. LinkedIn redirects back to callback endpoint

**Required LinkedIn App Setup:**
- Valid Client ID and Secret
- Redirect URI configured: \`http://localhost:3000/auth/linkedin/callback\`
- Permissions: r_liteprofile, r_emailaddress, w_member_social
    `,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to LinkedIn OAuth authorization page',
    headers: {
      Location: {
        description: 'LinkedIn OAuth authorization URL',
        schema: {
          type: 'string',
          example:
            'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=...',
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
  @UseGuards(AuthGuard('linkedin'))
  async linkedInAuth(): Promise<void> {
    // This method initiates the LinkedIn OAuth flow
    // The actual redirect is handled by Passport
  }

  @ApiOperation({
    summary: 'LinkedIn OAuth callback handler',
    description: `
Handles the OAuth callback from LinkedIn after user authorization.

**Process:**
1. LinkedIn redirects here with authorization code
2. Code is exchanged for access token
3. User profile data is retrieved
4. Response contains LinkedIn user information

**Note:** This endpoint is automatically called by LinkedIn and should not be invoked directly.
The response contains LinkedIn user data but NOT access tokens for security reasons.
Use the \`/auth/linkedin/link\` endpoint to associate the account with an authenticated user.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'LinkedIn OAuth callback processed successfully',
    type: LinkedInOAuthCallbackResponseDto,
    examples: {
      success: {
        summary: 'Successful OAuth callback',
        value: {
          success: true,
          message: 'LinkedIn authentication successful',
          linkedInData: {
            linkedInId: 'abc123def456',
            displayName: 'John Doe',
            email: 'john.doe@example.com',
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
          message: 'LinkedIn authentication failed',
          error: 'Invalid authorization code',
        },
      },
    },
  })
  @Get('callback')
  @UseGuards(AuthGuard('linkedin'))
  linkedInAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const linkedInUser = req.user as any;

      // For now, we'll need to get the user ID from the session or token
      // In a real implementation, you'd extract this from the authenticated user
      // This is a simplified example - you'd need to handle user authentication flow

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + 5184000); // 60 days default

      // This would need to be adapted based on your auth flow
      // For demo purposes, we'll return the LinkedIn user data

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'LinkedIn authentication successful',
        linkedInData: {
          linkedInId: linkedInUser.linkedInId,
          displayName: linkedInUser.displayName,
          email: linkedInUser.email,
          // Note: We don't return tokens for security
        },
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'LinkedIn authentication failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @ApiOperation({
    summary: 'Link LinkedIn account to authenticated user',
    description: `
Associates a LinkedIn account with the currently authenticated user.

**Requirements:**
- Valid JWT token in Authorization header
- LinkedIn account data from OAuth flow
- User must be authenticated

**Process:**
1. Verify JWT token
2. Store LinkedIn account credentials
3. Create social account link in database
4. Return account details

**Security Note:** Access tokens are stored securely and never returned in API responses.
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    description: 'LinkedIn OAuth data obtained from the OAuth flow',
    type: LinkedInLinkAccountRequestDto,
    examples: {
      linkAccount: {
        summary: 'Link LinkedIn account',
        value: {
          linkedInId: 'abc123def456',
          accessToken: 'AQVlKw...',
          refreshToken: 'AQVlKw...',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'LinkedIn account linked successfully',
    type: LinkedInLinkAccountResponseDto,
    examples: {
      success: {
        summary: 'Account linked successfully',
        value: {
          success: true,
          message: 'LinkedIn account linked successfully',
          account: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            platformUserId: 'abc123def456',
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
      'Invalid input data or LinkedIn account already linked to another user',
    type: ValidationErrorResponseDto,
    examples: {
      alreadyLinked: {
        summary: 'Account already linked',
        value: {
          success: false,
          message: 'LinkedIn account is already linked to another user',
        },
      },
      invalidToken: {
        summary: 'Invalid access token',
        value: {
          success: false,
          message: 'Invalid LinkedIn access token provided',
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
      linkedInId: string;
      accessToken: string;
      refreshToken?: string;
    },
  ) {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 5184000); // 60 days

    const account = await this.linkedInService.linkLinkedInAccount(
      user.userId,
      {
        linkedInId: body.linkedInId,
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        expiresAt,
      },
    );

    return {
      success: true,
      message: 'LinkedIn account linked successfully',
      account,
    };
  }

  @ApiOperation({
    summary: 'Unlink LinkedIn account from user',
    description: `
Removes the LinkedIn account association from the authenticated user.

**Effects:**
- Deactivates the social account link
- Prevents future LinkedIn API operations
- Preserves historical data but marks as inactive
- User will need to re-authenticate to use LinkedIn features again

**Note:** This does not revoke tokens on LinkedIn's side. Users should manually revoke 
access in their LinkedIn account settings for complete disconnection.
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'LinkedIn account unlinked successfully',
    type: LinkedInUnlinkResponseDto,
    examples: {
      success: {
        summary: 'Account unlinked successfully',
        value: {
          success: true,
          message: 'LinkedIn account unlinked successfully',
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
    await this.linkedInService.unlinkLinkedInAccount(user.userId);

    return {
      success: true,
      message: 'LinkedIn account unlinked successfully',
    };
  }

  @ApiOperation({
    summary: 'Check LinkedIn account link status',
    description: `
Retrieves the current LinkedIn account association status for the authenticated user.

**Returns:**
- Whether a LinkedIn account is currently linked
- Account details if linked (without sensitive token data)
- Useful for UI state management and conditional feature display

**Use Cases:**
- Show/hide LinkedIn posting features in UI
- Display account connection status
- Validate before attempting LinkedIn operations
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'LinkedIn account status retrieved successfully',
    type: LinkedInAccountStatusResponseDto,
    examples: {
      linked: {
        summary: 'Account is linked',
        value: {
          isLinked: true,
          account: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            platformUserId: 'abc123def456',
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
    const account = await this.linkedInService.getLinkedInAccount(user.userId);

    return {
      isLinked: !!account,
      account: account || null,
    };
  }

  @ApiOperation({
    summary: 'Retrieve LinkedIn profile information',
    description: `
Fetches the current user's LinkedIn profile data using stored access tokens.

**Retrieved Data:**
- Basic profile information (name, ID)
- Profile picture URL
- Email address
- LinkedIn-specific identifiers

**Requirements:**
- Valid JWT authentication
- LinkedIn account must be linked
- Valid access token (automatically refreshed if needed)

**Rate Limits:** This endpoint is subject to LinkedIn API rate limits.
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'LinkedIn profile retrieved successfully',
    type: LinkedInProfileResponseDto,
    examples: {
      success: {
        summary: 'Profile retrieved successfully',
        value: {
          success: true,
          profile: {
            id: 'abc123def456',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            profilePicture: 'https://media.licdn.com/dms/image/...',
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
    description: 'LinkedIn account not linked or API error',
    type: ValidationErrorResponseDto,
    examples: {
      notLinked: {
        summary: 'Account not linked',
        value: {
          success: false,
          message: 'LinkedIn account not linked',
        },
      },
      apiError: {
        summary: 'LinkedIn API error',
        value: {
          success: false,
          message: 'Failed to fetch LinkedIn profile',
          error: 'Invalid or expired access token',
        },
      },
    },
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: RequestUser) {
    const account = await this.linkedInService.getLinkedInAccount(user.userId);
    if (!account) {
      return {
        success: false,
        message: 'LinkedIn account not linked',
      };
    }

    const profile = await this.linkedInService.getLinkedInProfile(
      account.accessToken,
    );
    const email = await this.linkedInService.getLinkedInEmail(
      account.accessToken,
    );

    return {
      success: true,
      profile: {
        id: profile.id,
        firstName:
          profile.firstName.localized['en_US'] ||
          Object.values(profile.firstName.localized)[0],
        lastName:
          profile.lastName.localized['en_US'] ||
          Object.values(profile.lastName.localized)[0],
        email,
        profilePicture: profile.profilePicture?.displayImage,
      },
    };
  }

  @ApiOperation({
    summary: 'Post content to LinkedIn',
    description: `
Publishes content to the user's LinkedIn profile using the LinkedIn API.

**Supported Content Types:**
- Text-only posts
- Posts with images (via imageUrl)
- Posts with link previews (via linkUrl)
- Combined text, image, and link posts

**Requirements:**
- Valid JWT authentication
- LinkedIn account must be linked with write permissions
- Valid access token with w_member_social scope

**Rate Limits:** Subject to LinkedIn API posting limits (approximately 25 posts per day per user).

**Content Guidelines:** Posts must comply with LinkedIn's content policies and community standards.
    `,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    type: LinkedInPostDto,
    description: 'Content to post to LinkedIn',
    examples: {
      textOnly: {
        summary: 'Text-only post',
        value: {
          text: 'Excited to share this amazing news with my network! 🚀',
        },
      },
      withImage: {
        summary: 'Post with image',
        value: {
          text: 'Check out this great article!',
          imageUrl: 'https://example.com/image.jpg',
        },
      },
      withLink: {
        summary: 'Post with link preview',
        value: {
          text: 'Must-read article for developers',
          linkUrl: 'https://example.com/article',
        },
      },
      withBoth: {
        summary: 'Post with image and link',
        value: {
          text: 'Amazing insights in this article',
          imageUrl: 'https://example.com/thumbnail.jpg',
          linkUrl: 'https://example.com/article',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Content posted to LinkedIn successfully',
    type: LinkedInPostResponseDto,
    examples: {
      success: {
        summary: 'Post published successfully',
        value: {
          success: true,
          message: 'Content posted to LinkedIn successfully',
          postId: 'urn:li:share:12345678901234567890',
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
      'LinkedIn account not linked, invalid content, or posting failed',
    type: ValidationErrorResponseDto,
    examples: {
      notLinked: {
        summary: 'Account not linked',
        value: {
          success: false,
          message: 'LinkedIn account not linked',
        },
      },
      postingFailed: {
        summary: 'Posting failed',
        value: {
          success: false,
          message: 'Failed to post to LinkedIn',
          error: 'Content violates LinkedIn policies',
        },
      },
      rateLimited: {
        summary: 'Rate limit exceeded',
        value: {
          success: false,
          message: 'Failed to post to LinkedIn',
          error: 'Rate limit exceeded - daily posting limit reached',
        },
      },
    },
  })
  @Post('post')
  @UseGuards(JwtAuthGuard)
  async postToLinkedIn(
    @CurrentUser() user: RequestUser,
    @Body() postData: LinkedInPostDto,
  ) {
    const result = await this.linkedInService.postToLinkedIn(
      user.userId,
      postData,
    );

    return {
      success: true,
      message: 'Content posted to LinkedIn successfully',
      postId: result.id,
    };
  }
}
