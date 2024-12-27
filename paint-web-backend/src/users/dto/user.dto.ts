import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../entities/user.entity';
import { Types } from 'mongoose';

export class UserDto {
  static fromDomain(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  id: Types.ObjectId;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  createdAt: Date;

  updatedAt: Date;
}
