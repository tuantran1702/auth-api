import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from './utils/password.utils';
import { SignInDto } from './dto/sign-in.dto';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginData: SignInDto): Promise<any> {
    const user = await this.usersService.findOneByUsername(loginData.username);

    if (user) {
      const valid = comparePassword(user.password, loginData.password);
      if (valid) {
        const { password, ...result } = user;
        // TODO: Generate a JWT and return it here
        // instead of the user object
        const payload = { sub: user.id, username: user.username };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
    }
    return new UnauthorizedException('Invalid Credentials');
  }
}
