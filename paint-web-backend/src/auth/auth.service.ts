import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Method that handles user login.
   *
   * @param username Username.
   * @param pass Password.
   * @returns { Promise<{ access_token: string }> } JSON Web Token.
   */
  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(username);
    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * Method that handles user creation.
   *
   * @param createUserDto User's data.
   * @returns { Promise<User> } User created.
   */
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.encryptPassword(createUserDto.password);
    try {
      const user = await this.usersService.create(createUserDto);
      return user;
    } catch (error) {
      let message = 'Conflict Error';
      if (error.message.includes('unique_email')) {
        message = 'Email already exists';
      } else if (error.message.includes('unique_username')) {
        message = 'Username already exists';
      }
      throw new ConflictException(message);
    }
  }

  /**
   * Method that encrypts the user's password
   *
   * @param password User's password.
   * @returns { string } User's encrypted password.
   */
  private async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password, salt);

    return encryptedPassword;
  }
}
