export interface InstagramPublishedMediaResponse {
  id: string;
}

export interface InstagramProfile {
  id: string;
  username: string;
  displayName: string;
  name: {
    familyName?: string;
    givenName?: string;
    middleName?: string;
  };
  profileUrl: string;
  emails?: Array<{
    value: string;
    type?: string;
  }>;
  photos?: Array<{
    value: string;
  }>;
  provider: string;
  _raw: string;
  _json: InstagramUserData;
}

export interface InstagramUserData {
  id: string;
  username: string;
  account_type: 'PERSONAL' | 'BUSINESS' | 'CREATOR';
  media_count?: number;
}

export interface InstagramMediaResponse {
  data: InstagramMedia[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  caption?: string;
  timestamp: string;
  username: string;
}

export interface InstagramTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

export interface InstagramPostRequest {
  image_url?: string;
  video_url?: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  children?: Array<{
    media_type: 'IMAGE' | 'VIDEO';
    media_url: string;
  }>;
}
