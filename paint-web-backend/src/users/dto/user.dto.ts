import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../entities/user.entity';

export class UserDto {
  static fromDomain(user: User): UserDto {
    return {
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  createdAt: Date;

  updatedAt: Date;
}
