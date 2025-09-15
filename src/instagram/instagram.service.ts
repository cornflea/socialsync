import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { SocialAccount, User, SocialPlatform } from '../entities';
import {
  InstagramUserData,
  InstagramMediaResponse,
  InstagramTokenResponse,
  InstagramPostRequest,
  InstagramPublishedMediaResponse,
} from './interfaces/instagram-profile.interface';

@Injectable()
export class InstagramService {
  private readonly baseURL = 'https://graph.instagram.com';
  private readonly basicDisplayURL = 'https://graph.instagram.com';

  constructor(
    @InjectRepository(SocialAccount)
    private socialAccountRepository: Repository<SocialAccount>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async getInstagramProfile(accessToken: string): Promise<InstagramUserData> {
    try {
      const response = await axios.get(`${this.basicDisplayURL}/me`, {
        params: {
          fields: 'id,username,account_type,media_count',
          access_token: accessToken,
        },
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to fetch Instagram profile');
    }
  }

  async getInstagramMedia(
    accessToken: string,
    limit = 25,
  ): Promise<InstagramMediaResponse> {
    try {
      const response = await axios.get(`${this.basicDisplayURL}/me/media`, {
        params: {
          fields:
            'id,media_type,media_url,permalink,thumbnail_url,caption,timestamp,username',
          limit,
          access_token: accessToken,
        },
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to fetch Instagram media');
    }
  }

  async linkInstagramAccount(
    userId: string,
    instagramData: {
      instagramId: string;
      accessToken: string;
      refreshToken?: string;
      expiresAt?: Date;
    },
  ): Promise<SocialAccount> {
    // Check if Instagram account is already linked to another user
    const existingAccount = await this.socialAccountRepository.findOne({
      where: {
        platform: SocialPlatform.INSTAGRAM,
        platformUserId: instagramData.instagramId,
      },
    });

    if (existingAccount && existingAccount.userId !== userId) {
      throw new BadRequestException(
        'Instagram account is already linked to another user',
      );
    }

    // Update existing or create new
    if (existingAccount) {
      existingAccount.accessToken = instagramData.accessToken;
      existingAccount.refreshToken = instagramData.refreshToken;
      existingAccount.tokenExpiresAt = instagramData.expiresAt;
      existingAccount.isActive = true;

      return this.socialAccountRepository.save(existingAccount);
    }

    // Create new social account
    const socialAccount = this.socialAccountRepository.create({
      userId,
      platform: SocialPlatform.INSTAGRAM,
      platformUserId: instagramData.instagramId,
      accessToken: instagramData.accessToken,
      refreshToken: instagramData.refreshToken,
      tokenExpiresAt: instagramData.expiresAt,
      isActive: true,
    });

    return this.socialAccountRepository.save(socialAccount);
  }

  async unlinkInstagramAccount(userId: string): Promise<void> {
    await this.socialAccountRepository.update(
      {
        userId,
        platform: SocialPlatform.INSTAGRAM,
      },
      {
        isActive: false,
      },
    );
  }

  async getInstagramAccount(userId: string): Promise<SocialAccount | null> {
    return this.socialAccountRepository.findOne({
      where: {
        userId,
        platform: SocialPlatform.INSTAGRAM,
        isActive: true,
      },
    });
  }

  async refreshInstagramToken(
    refreshToken: string,
  ): Promise<InstagramTokenResponse> {
    try {
      const response = await axios.post(
        `${this.basicDisplayURL}/refresh_access_token`,
        null,
        {
          params: {
            grant_type: 'ig_refresh_token',
            access_token: refreshToken,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to refresh Instagram token');
    }
  }

  async createInstagramMediaObject(
    userId: string,
    postData: InstagramPostRequest,
  ): Promise<any> {
    const account = await this.getInstagramAccount(userId);
    if (!account) {
      throw new BadRequestException('Instagram account not linked');
    }

    try {
      const mediaData: any = {
        access_token: account.accessToken,
      };

      if (postData.media_type === 'IMAGE' && postData.image_url) {
        mediaData.image_url = postData.image_url;
      } else if (postData.media_type === 'VIDEO' && postData.video_url) {
        mediaData.media_type = 'VIDEO';
        mediaData.video_url = postData.video_url;
      } else if (
        postData.media_type === 'CAROUSEL_ALBUM' &&
        postData.children
      ) {
        mediaData.media_type = 'CAROUSEL_ALBUM';
        mediaData.children = postData.children;
      }

      if (postData.caption) {
        mediaData.caption = postData.caption;
      }

      const response = await axios.post(
        `${this.baseURL}/${account.platformUserId}/media`,
        null,
        {
          params: mediaData,
        },
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to create Instagram media object');
    }
  }

  async publishInstagramMedia(userId: string, mediaId: string): Promise<any> {
    const account = await this.getInstagramAccount(userId);
    if (!account) {
      throw new BadRequestException('Instagram account not linked');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/${account.platformUserId}/media_publish`,
        null,
        {
          params: {
            creation_id: mediaId,
            access_token: account.accessToken,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to publish Instagram media');
    }
  }

  async postToInstagram(
    userId: string,
    postData: InstagramPostRequest,
  ): Promise<InstagramPublishedMediaResponse> {
    // Step 1: Create media object
    const mediaObject = await this.createInstagramMediaObject(userId, postData);

    // Step 2: Publish the media
    const publishedMedia = await this.publishInstagramMedia(
      userId,
      mediaObject.id,
    );

    return publishedMedia;
  }
}
