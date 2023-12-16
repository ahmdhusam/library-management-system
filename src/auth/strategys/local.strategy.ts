import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService, ValidateUserInput } from '../auth.service';
import { isEmail } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'usernameOrEmail' });
  }

  async validate(usernameOrEmail: string, password: string): Promise<any> {
    const claims: ValidateUserInput = { password };

    if (isEmail(usernameOrEmail)) claims.email = usernameOrEmail;
    else claims.username = usernameOrEmail;

    const user = await this.authService.getValidUser(claims);

    return user;
  }
}
