import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-instagram';

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('INSTAGRAM_CLIENT_ID')!,
      clientSecret: configService.get<string>('INSTAGRAM_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('INSTAGRAM_CALLBACK_URL')!,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ): void {
    try {
      const { id, username, displayName, photos } = profile;

      const instagramUser = {
        instagramId: id,
        username,
        displayName,
        photo: photos?.[0]?.value || '',
        accessToken,
        refreshToken,
      };

      done(null, instagramUser);
    } catch (error) {
      done(error, null);
    }
  }
}
