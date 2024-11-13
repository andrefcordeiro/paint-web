import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @Length(8)
  password: string;
}
