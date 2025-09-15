import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { PostPublication } from './post-publication.entity';

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
}

@Entity('posts')
export class Post {
  @ApiProperty({
    description: 'Unique identifier for the post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'User ID who created the post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty({
    description: 'Post title',
    example: 'My first social media post',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Post content/text',
    example:
      'This is the content of my post that will be shared across social media platforms.',
  })
  @Column('text')
  content: string;

  @ApiProperty({
    description: 'Media URLs (images, videos) associated with the post',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/video1.mp4',
    ],
    type: [String],
    required: false,
  })
  @Column('jsonb', { nullable: true })
  media: string[];

  @ApiProperty({
    description: 'Current status of the post',
    enum: PostStatus,
    example: PostStatus.DRAFT,
  })
  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @ApiProperty({
    description: 'Scheduled publication date/time',
    example: '2023-09-13T15:30:00Z',
    required: false,
  })
  @Column({ name: 'scheduled_at', nullable: true })
  scheduledAt?: Date;

  @ApiProperty({
    description: 'Publication status for each social media platform',
    type: () => [PostPublication],
  })
  @OneToMany(() => PostPublication, (publication) => publication.post)
  publications: PostPublication[];

  @ApiProperty({
    description: 'Post creation timestamp',
    example: '2023-09-13T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Last post update timestamp',
    example: '2023-09-13T10:30:00Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
