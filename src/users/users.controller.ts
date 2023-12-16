import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Patch,
  Put,
} from '@nestjs/common';
import { CurrentUser } from './users.decorator';
import { User } from '../database/database.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { UseSerialize } from '../core/serialize/serialize.decorator';
import { UsersSerialize } from './dtos';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GlobalSerialize } from '../core/dtos/global.serialize';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ChangeEmailDto } from './dtos/change-email.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({
    type: UsersSerialize,
  })
  @ApiUnauthorizedResponse()
  @UseSerialize(UsersSerialize)
  @Get('me')
  async me(@CurrentUser() currentUser: User): Promise<User> {
    return currentUser;
  }

  @ApiOkResponse({
    description: 'The User data updated successfully',
    type: UsersSerialize,
  })
  @ApiConflictResponse({ description: 'username or email is in use' })
  @UseSerialize(UsersSerialize)
  @Patch()
  async update(
    @CurrentUser() currentUser: User,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.userService.update(currentUser.id, data);
    } catch (err) {
      switch (err.code) {
        case 'P2002':
          throw new ConflictException('username or email is in use');
        default: {
          this.logger.error('update throw: ', err.stack);
          throw new BadRequestException();
        }
      }
    }
  }

  @ApiOkResponse({
    description: 'The password was changed successfully.',
    type: GlobalSerialize,
  })
  @ApiForbiddenResponse({ description: 'Password does not match.' })
  @ApiUnauthorizedResponse()
  @Put('password')
  async changePassword(
    @CurrentUser() currentUser: User,
    @Body() passwords: ChangePasswordDto,
  ): Promise<GlobalSerialize> {
    const isChanged = await this.userService.changePassword(
      currentUser,
      passwords.password,
      passwords.newPassword,
    );

    if (!isChanged) throw new ForbiddenException('Password does not match.');

    return { message: 'The password was changed successfully.' };
  }

  @ApiOkResponse({
    description: 'The Email was changed successfully.',
    type: UsersSerialize,
  })
  @ApiForbiddenResponse({ description: 'Password does not match.' })
  @ApiUnauthorizedResponse()
  @UseSerialize(UsersSerialize)
  @Put('email')
  async changeEmail(
    @CurrentUser() currentUser: User,
    @Body() data: ChangeEmailDto,
  ): Promise<User> {
    const updatedUser = await this.userService.changeEmail(
      currentUser,
      data.password,
      data.email,
    );
    if (!updatedUser) throw new ForbiddenException('Password does not match.');

    return updatedUser;
  }
}
