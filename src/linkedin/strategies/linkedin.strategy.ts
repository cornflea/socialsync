import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-linkedin-oauth2';
import { LinkedInService } from '../linkedin.service';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    private configService: ConfigService,
    private linkedInService: LinkedInService,
  ) {
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID')!,
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('LINKEDIN_CALLBACK_URL')!,
      scope: [
        'openid',
        'profile',
        'email',
        // 'r_liteprofile',
        // 'r_emailaddress',
        // 'w_member_social',
      ],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ): void {
    try {
      const { id, displayName, emails, photos } = profile;

      const linkedInUser = {
        linkedInId: id,
        displayName,
        email: emails?.[0]?.value || '',
        photo: photos?.[0]?.value || '',
        accessToken,
        refreshToken,
      };

      done(null, linkedInUser);
    } catch (error) {
      done(error, null);
    }
  }
}
