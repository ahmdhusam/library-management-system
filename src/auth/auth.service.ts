import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../database/database.service';
import { UserUniqueInput } from '../users/users.repository';

export type ValidateUserInput = Omit<UserUniqueInput, 'id'> &
  Pick<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async getValidUser({ password, ...rest }: ValidateUserInput) {
    const user = await this.usersService.getOneBy(rest);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await this.usersService.isValidPassword(
      user.password,
      password,
    );
    if (!isMatch) throw new BadRequestException('Password do not match');

    return user;
  }

  makeToken(id: number) {
    const payload = { sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
