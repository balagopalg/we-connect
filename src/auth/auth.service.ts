import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@users/users.service';
import { UserLoginDTO } from './dto/user-login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user with provided login credentials and generates an access token.
   * @param loginData The user login credentials including email and password.
   * @returns A Promise resolving to an object containing accessToken and userId upon successful authentication.
   * @throws BadRequestException If authentication fails due to invalid credentials or other errors.
   */
  async userLogin(
    loginData: UserLoginDTO,
  ): Promise<{ accessToken: string; userId: string }> {
    try {
      const { email, password } = loginData;

      const userData = await this.usersService.findUser(email, true);
      if (!userData) {
        throw new BadRequestException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
      }

      const accessToken = this.jwtService.sign({ id: userData._id });
      return { accessToken, userId: userData._id as unknown as any };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
