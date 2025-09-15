# LinkedIn Integration API Documentation

## Overview

The LinkedIn Integration module provides comprehensive OAuth authentication and API integration for LinkedIn social media platform. This module allows users to authenticate with LinkedIn, link their accounts, and perform various LinkedIn operations such as profile retrieval and content posting.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [API Endpoints](#api-endpoints)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Rate Limits](#rate-limits)
6. [Setup Instructions](#setup-instructions)
7. [Security Considerations](#security-considerations)

## Authentication Flow

### Standard OAuth 2.0 Flow

1. **Initiate OAuth**: `GET /auth/linkedin`
   - Redirects user to LinkedIn authorization page
   - User grants permissions to your application
   
2. **OAuth Callback**: `GET /auth/linkedin/callback`
   - LinkedIn redirects back with authorization code
   - Application exchanges code for access token
   - Returns LinkedIn user profile data

3. **Link Account**: `POST /auth/linkedin/link`
   - Associates LinkedIn account with authenticated application user
   - Stores access tokens securely in database

### Required LinkedIn Permissions

- `r_liteprofile` - Access to basic profile information
- `r_emailaddress` - Access to user's email address
- `w_member_social` - Permission to post content on user's behalf

## API Endpoints

### OAuth Endpoints

#### `GET /auth/linkedin`
**Initiate LinkedIn OAuth Flow**

Redirects the user to LinkedIn's OAuth authorization page.

**Response:**
- `302 Redirect` to LinkedIn OAuth page

**Example:**
```
GET /auth/linkedin
```

#### `GET /auth/linkedin/callback`
**OAuth Callback Handler**

Handles the OAuth callback from LinkedIn after user authorization.

**Query Parameters:**
- `code` (string) - Authorization code from LinkedIn
- `state` (string) - State parameter for security

**Response:**
```json
{
  "success": true,
  "message": "LinkedIn authentication successful",
  "linkedInData": {
    "linkedInId": "abc123def456",
    "displayName": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

### Account Management Endpoints

#### `POST /auth/linkedin/link`
**Link LinkedIn Account**

Associates a LinkedIn account with the authenticated user.

**Headers:**
- `Authorization: Bearer <jwt-token>`

**Request Body:**
```json
{
  "linkedInId": "abc123def456",
  "accessToken": "AQVlKw...",
  "refreshToken": "AQVlKw..." // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "LinkedIn account linked successfully",
  "account": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "platformUserId": "abc123def456",
    "isActive": true,
    "tokenExpiresAt": "2024-03-13T10:30:00Z",
    "createdAt": "2023-09-13T10:30:00Z",
    "updatedAt": "2023-09-13T10:30:00Z"
  }
}
```

#### `POST /auth/linkedin/unlink`
**Unlink LinkedIn Account**

Removes the LinkedIn account association from the user.

**Headers:**
- `Authorization: Bearer <jwt-token>`

**Response:**
```json
{
  "success": true,
  "message": "LinkedIn account unlinked successfully"
}
```

#### `GET /auth/linkedin/status`
**Check Account Status**

Retrieves the current LinkedIn account link status.

**Headers:**
- `Authorization: Bearer <jwt-token>`

**Response:**
```json
{
  "isLinked": true,
  "account": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "platformUserId": "abc123def456",
    "isActive": true,
    "tokenExpiresAt": "2024-03-13T10:30:00Z",
    "createdAt": "2023-09-13T10:30:00Z",
    "updatedAt": "2023-09-13T10:30:00Z"
  }
}
```

### Profile and Content Endpoints

#### `GET /auth/linkedin/profile`
**Get LinkedIn Profile**

Retrieves the user's LinkedIn profile information.

**Headers:**
- `Authorization: Bearer <jwt-token>`

**Response:**
```json
{
  "success": true,
  "profile": {
    "id": "abc123def456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "profilePicture": "https://media.licdn.com/dms/image/..."
  }
}
```

#### `POST /auth/linkedin/post`
**Post Content to LinkedIn**

Publishes content to the user's LinkedIn profile.

**Headers:**
- `Authorization: Bearer <jwt-token>`

**Request Body:**
```json
{
  "text": "Check out this amazing article!",
  "imageUrl": "https://example.com/image.jpg", // optional
  "linkUrl": "https://example.com/article"     // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Content posted to LinkedIn successfully",
  "postId": "urn:li:share:12345678901234567890"
}
```

## Data Models

### LinkedInAccountDto
```typescript
{
  id: string;                    // Account ID
  platformUserId: string;        // LinkedIn user ID
  isActive: boolean;            // Whether account is active
  tokenExpiresAt?: Date;        // Token expiration
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last update timestamp
}
```

### LinkedInPostDto
```typescript
{
  text: string;                 // Post content (required)
  imageUrl?: string;            // Optional image URL
  linkUrl?: string;             // Optional link URL
}
```

### LinkedInProfileDto
```typescript
{
  id: string;                   // LinkedIn user ID
  firstName: string;            // User first name
  lastName: string;             // User last name
  email: string;                // User email
  profilePicture?: string;      // Profile picture URL
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information" // optional
}
```

### Common Error Codes

- `400 Bad Request` - Invalid input data or API error
- `401 Unauthorized` - Invalid or missing JWT token
- `409 Conflict` - Account already linked to another user
- `500 Internal Server Error` - Server-side error

### LinkedIn-Specific Errors

- **Account Not Linked**: User hasn't connected LinkedIn account
- **Invalid Access Token**: Token expired or revoked
- **Rate Limit Exceeded**: Too many API requests
- **Content Policy Violation**: Post content violates LinkedIn policies

## Rate Limits

LinkedIn API has the following rate limits:

- **Profile API**: 500 requests per day per user
- **Posting API**: 25 posts per day per user
- **OAuth**: 1000 authorization requests per day

The module includes automatic error handling for rate limit scenarios.

## Setup Instructions

### 1. Create LinkedIn Application

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create a new application
3. Configure OAuth settings:
   - **Redirect URLs**: `http://localhost:3000/auth/linkedin/callback`
   - **Scopes**: `r_liteprofile`, `r_emailaddress`, `w_member_social`

### 2. Environment Configuration

Add the following environment variables:

```bash
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=http://localhost:3000/auth/linkedin/callback
```

### 3. Database Setup

The module uses the existing `social_accounts` table. Ensure your database is migrated with the latest schema.

## Security Considerations

### Token Storage
- Access tokens are stored encrypted in the database
- Tokens are never returned in API responses
- Refresh tokens are used for automatic token renewal

### OAuth Security
- State parameter validation prevents CSRF attacks
- Secure redirect URI validation
- Token exchange happens server-side only

### API Security
- All endpoints require valid JWT authentication
- Rate limiting prevents abuse
- Input validation on all request data

### Best Practices
1. Regularly rotate LinkedIn application credentials
2. Monitor for unusual API usage patterns
3. Implement proper logging for security events
4. Use HTTPS in production environments

## Example Integration

### Frontend Integration
```javascript
// Initiate OAuth
window.location.href = '/auth/linkedin';

// Handle successful linking
const linkAccount = async (linkedInData) => {
  const response = await fetch('/auth/linkedin/link', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userJwtToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(linkedInData)
  });
  return response.json();
};

// Post to LinkedIn
const postToLinkedIn = async (content) => {
  const response = await fetch('/auth/linkedin/post', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userJwtToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  });
  return response.json();
};
```

### Backend Integration
```typescript
// Check if user has LinkedIn linked
const hasLinkedIn = await linkedInService.getLinkedInAccount(userId);

// Post content programmatically
if (hasLinkedIn) {
  await linkedInService.postToLinkedIn(userId, {
    text: 'Automated post content',
    linkUrl: 'https://example.com'
  });
}
```

## Support and Resources

- [LinkedIn Developer Documentation](https://docs.microsoft.com/en-us/linkedin/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [Swagger UI](http://localhost:3000/api) - Interactive API documentation

For additional support, please refer to the application logs and error responses for detailed debugging information.
