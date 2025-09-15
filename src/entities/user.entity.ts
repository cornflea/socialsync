import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { SocialAccount } from './social-account.entity';
import { Post } from './post.entity';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    uniqueItems: true,
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @Column()
  lastName: string;

  @ApiHideProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
    default: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Connected social media accounts',
    type: () => [SocialAccount],
  })
  @OneToMany(() => SocialAccount, (socialAccount) => socialAccount.user)
  socialAccounts: SocialAccount[];

  @ApiProperty({
    description: 'Posts created by the user',
    type: () => [Post],
  })
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2023-09-13T10:30:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last account update timestamp',
    example: '2023-09-13T10:30:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
