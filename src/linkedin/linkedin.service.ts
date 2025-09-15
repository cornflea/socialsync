import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { SocialAccount, User, SocialPlatform } from '../entities';
import {
  LinkedInProfile,
  LinkedInEmailResponse,
  LinkedInTokenResponse,
} from './interfaces/linkedin-profile.interface';

@Injectable()
export class LinkedInService {
  private readonly baseURL = 'https://api.linkedin.com/v2';

  constructor(
    @InjectRepository(SocialAccount)
    private socialAccountRepository: Repository<SocialAccount>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async getLinkedInProfile(accessToken: string): Promise<LinkedInProfile> {
    try {
      const response = await axios.get(`${this.baseURL}/people/~`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          projection:
            '(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
        },
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to fetch LinkedIn profile');
    }
  }

  async getLinkedInEmail(accessToken: string): Promise<string> {
    try {
      const response = await axios.get(
        `${this.baseURL}/emailAddresses?q=members&projection=(elements*(handle~))`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const emailData: LinkedInEmailResponse = response.data;
      const primaryEmail = emailData.elements.find((el) => el.primary);

      return (
        primaryEmail?.['handle~']?.emailAddress ||
        emailData.elements[0]?.['handle~']?.emailAddress ||
        ''
      );
    } catch (error) {
      throw new BadRequestException('Failed to fetch LinkedIn email');
    }
  }

  async linkLinkedInAccount(
    userId: string,
    linkedInData: {
      linkedInId: string;
      accessToken: string;
      refreshToken?: string;
      expiresAt?: Date;
    },
  ): Promise<SocialAccount> {
    // Check if LinkedIn account is already linked to another user
    const existingAccount = await this.socialAccountRepository.findOne({
      where: {
        platform: SocialPlatform.LINKEDIN,
        platformUserId: linkedInData.linkedInId,
      },
    });

    if (existingAccount && existingAccount.userId !== userId) {
      throw new BadRequestException(
        'LinkedIn account is already linked to another user',
      );
    }

    // Update existing or create new
    if (existingAccount) {
      existingAccount.accessToken = linkedInData.accessToken;
      existingAccount.refreshToken = linkedInData.refreshToken;
      existingAccount.tokenExpiresAt = linkedInData.expiresAt;
      existingAccount.isActive = true;

      return this.socialAccountRepository.save(existingAccount);
    }

    // Create new social account
    const socialAccount = this.socialAccountRepository.create({
      userId,
      platform: SocialPlatform.LINKEDIN,
      platformUserId: linkedInData.linkedInId,
      accessToken: linkedInData.accessToken,
      refreshToken: linkedInData.refreshToken,
      tokenExpiresAt: linkedInData.expiresAt,
      isActive: true,
    });

    return this.socialAccountRepository.save(socialAccount);
  }

  async unlinkLinkedInAccount(userId: string): Promise<void> {
    await this.socialAccountRepository.update(
      {
        userId,
        platform: SocialPlatform.LINKEDIN,
      },
      {
        isActive: false,
      },
    );
  }

  async getLinkedInAccount(userId: string): Promise<SocialAccount | null> {
    return this.socialAccountRepository.findOne({
      where: {
        userId,
        platform: SocialPlatform.LINKEDIN,
        isActive: true,
      },
    });
  }

  async refreshLinkedInToken(
    refreshToken: string,
  ): Promise<LinkedInTokenResponse> {
    try {
      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.configService.get<string>('LINKEDIN_CLIENT_ID')!,
          client_secret: this.configService.get<string>(
            'LINKEDIN_CLIENT_SECRET',
          )!,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to refresh LinkedIn token');
    }
  }

  async postToLinkedIn(
    userId: string,
    content: {
      text: string;
      imageUrl?: string;
      linkUrl?: string;
    },
  ): Promise<any> {
    const account = await this.getLinkedInAccount(userId);
    if (!account) {
      throw new BadRequestException('LinkedIn account not linked');
    }

    try {
      const postData: any = {
        author: `urn:li:person:${account.platformUserId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content.text,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      // Add media if provided
      if (content.imageUrl || content.linkUrl) {
        postData.specificContent[
          'com.linkedin.ugc.ShareContent'
        ].shareMediaCategory = 'ARTICLE';
        postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
          {
            status: 'READY',
            description: {
              text: content.text,
            },
            originalUrl: content.linkUrl || content.imageUrl,
            title: {
              text: 'Shared Content',
            },
          },
        ];
      }

      const response = await axios.post(`${this.baseURL}/ugcPosts`, postData, {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      return response.data;
    } catch {
      throw new BadRequestException('Failed to post to LinkedIn');
    }
  }
}
