import { IsNotEmpty, IsEmail, Length, IsString } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'Please enter username' })
  @IsString({ message: 'Please enter valid name' })
  username: string;

  @IsEmail({}, { message: 'Please Enter a Valid Email' })
  email: string;

  @Length(6, 50, {
    message: 'Password length Must be between 6 and 50 charcters',
  })
  password: string;
}
