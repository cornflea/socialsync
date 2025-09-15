import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { SocialPlatform } from './social-account.entity';

export enum PublicationStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
  FAILED = 'failed',
}

@Entity('post_publications')
export class PostPublication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.publications)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ name: 'post_id' })
  postId: string;

  @Column({
    type: 'enum',
    enum: SocialPlatform,
  })
  platform: SocialPlatform;

  @Column({
    type: 'enum',
    enum: PublicationStatus,
    default: PublicationStatus.PENDING,
  })
  status: PublicationStatus;

  @Column({ name: 'platform_post_id', nullable: true })
  platformPostId?: string;

  @Column({ name: 'error_message', nullable: true })
  errorMessage?: string;

  @Column({ name: 'published_at', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
