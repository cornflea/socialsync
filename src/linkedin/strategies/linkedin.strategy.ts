import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { LinkedInService } from '../linkedin.service';

interface LinkedInProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  email?: string;
  email_verified?: boolean;
}

@Injectable()
export class LinkedInStrategy extends PassportStrategy(
  OAuth2Strategy,
  'linkedin',
) {
  private readonly logger = new Logger(LinkedInStrategy.name);

  constructor(
    private configService: ConfigService,
    private linkedInService: LinkedInService,
  ) {
    super({
      authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID')!,
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('LINKEDIN_CALLBACK_URL')!,
      scope: ['openid', 'profile', 'email', 'w_member_social'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void,
  ): Promise<void> {
    try {
      // Use the userinfo endpoint to get profile data with OpenID Connect
      const response = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `LinkedIn API returned ${response.status}: ${response.statusText}`,
        );
      }

      const linkedInProfile = (await response.json()) as LinkedInProfile;

      this.logger.debug(`LinkedIn profile: ${JSON.stringify(linkedInProfile)}`);
      this.logger.debug(`Access Token: ${accessToken}`);
      this.logger.debug(`Refresh Token: ${refreshToken}`);

      const linkedInUser = {
        linkedInId: linkedInProfile.sub,
        displayName: linkedInProfile.name,
        email: linkedInProfile.email || '',
        photo: linkedInProfile.picture || '',
        accessToken,
        refreshToken,
      };

      done(null, linkedInUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`LinkedIn OAuth error: ${errorMessage}`);
      done(error, null);
    }
  }
}
