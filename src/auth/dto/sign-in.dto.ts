import { IsString } from 'class-validator';

export class SignInDto {
  @IsString({ message: 'Please enter valid username' })
  username: string;
  password: string;
}
