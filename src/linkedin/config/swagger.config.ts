import { DocumentBuilder } from '@nestjs/swagger';

export const createLinkedInSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('LinkedIn Integration API')
    .setDescription(`
# LinkedIn OAuth Integration

This module provides comprehensive LinkedIn OAuth integration for social media posting.

## Authentication Flow

1. **Initiate OAuth**: \`GET /auth/linkedin\` - Redirects to LinkedIn for authorization
2. **OAuth Callback**: \`GET /auth/linkedin/callback\` - Handles LinkedIn's response
3. **Link Account**: \`POST /auth/linkedin/link\` - Associates LinkedIn account with user
4. **Use APIs**: Access LinkedIn profile and posting features

## Required LinkedIn App Permissions

- \`r_liteprofile\` - Access to profile information
- \`r_emailaddress\` - Access to email address  
- \`w_member_social\` - Permission to post content

## Setup Instructions

1. Create a LinkedIn app at [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Configure redirect URI: \`http://localhost:3000/auth/linkedin/callback\`
3. Set environment variables:
   - \`LINKEDIN_CLIENT_ID\`
   - \`LINKEDIN_CLIENT_SECRET\`
   - \`LINKEDIN_CALLBACK_URL\`

## Error Handling

All endpoints return consistent error responses with:
- \`success\`: boolean indicating operation status
- \`message\`: human-readable error message
- \`error\`: detailed error information (optional)

## Rate Limits

LinkedIn API has rate limits. This module includes basic error handling for rate limit exceeded scenarios.
    `)
    .setVersion('1.0')
    .addTag('linkedin', 'LinkedIn OAuth and API integration')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
            tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
            scopes: {
              'r_liteprofile': 'Access to profile information',
              'r_emailaddress': 'Access to email address',
              'w_member_social': 'Permission to post content',
            },
          },
        },
      },
      'linkedin-oauth',
    )
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://api.yourdomain.com', 'Production server')
    .build();
};

export const linkedInApiExamples = {
  oauthInitiate: {
    summary: 'Initiate LinkedIn OAuth',
    description: 'Start the LinkedIn OAuth flow by redirecting user to LinkedIn authorization page',
    value: {
      redirectUrl: 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=xyz&redirect_uri=...',
      state: 'random-state-string-12345'
    }
  },
  oauthCallback: {
    summary: 'Successful OAuth callback',
    description: 'Response after successful LinkedIn OAuth authorization',
    value: {
      success: true,
      message: 'LinkedIn authentication successful',
      linkedInData: {
        linkedInId: 'abc123def456',
        displayName: 'John Doe',
        email: 'john.doe@example.com'
      }
    }
  },
  linkAccount: {
    summary: 'Link LinkedIn account',
    description: 'Successfully link LinkedIn account to authenticated user',
    value: {
      success: true,
      message: 'LinkedIn account linked successfully',
      account: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        platformUserId: 'abc123def456',
        isActive: true,
        tokenExpiresAt: '2024-03-13T10:30:00Z',
        createdAt: '2023-09-13T10:30:00Z',
        updatedAt: '2023-09-13T10:30:00Z'
      }
    }
  },
  accountStatus: {
    summary: 'Account status response',
    description: 'Check if LinkedIn account is linked',
    value: {
      isLinked: true,
      account: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        platformUserId: 'abc123def456',
        isActive: true,
        tokenExpiresAt: '2024-03-13T10:30:00Z',
        createdAt: '2023-09-13T10:30:00Z',
        updatedAt: '2023-09-13T10:30:00Z'
      }
    }
  },
  profileData: {
    summary: 'LinkedIn profile data',
    description: 'Retrieved LinkedIn profile information',
    value: {
      success: true,
      profile: {
        id: 'abc123def456',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        profilePicture: 'https://media.licdn.com/dms/image/...'
      }
    }
  },
  postSuccess: {
    summary: 'Successful LinkedIn post',
    description: 'Content successfully posted to LinkedIn',
    value: {
      success: true,
      message: 'Content posted to LinkedIn successfully',
      postId: 'urn:li:share:12345678901234567890'
    }
  },
  unlinkAccount: {
    summary: 'Unlink account response',
    description: 'Successfully unlinked LinkedIn account',
    value: {
      success: true,
      message: 'LinkedIn account unlinked successfully'
    }
  },
  errorResponse: {
    summary: 'Error response',
    description: 'Standard error response format',
    value: {
      success: false,
      message: 'LinkedIn account not linked',
      error: 'User has not linked their LinkedIn account'
    }
  }
};
