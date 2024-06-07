import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserLoginDTO } from 'src/auth/dto/user-login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async userLogin(
    loginData: UserLoginDTO,
  ): Promise<{ accessToken: string; userId: string }> {
    try {
      const { username, password } = loginData;
      if (!username || !password) {
        throw new BadRequestException('Invalid request');
      }
      const emailExist = await this.usersService.findUser(username, true);
      const usernameExist = await this.usersService.findUser(username, false);
      if (!emailExist && !usernameExist) {
        throw new BadRequestException('Invalid login credentials');
      }
      const userData = emailExist ? emailExist : usernameExist;
      const correctPasword = await bcrypt.compare(password, userData.password);
      if (!correctPasword) {
        throw new BadRequestException('Invalid login credentials');
      }
      const token = this.jwtService.sign({ id: userData._id });
      return { accessToken: token, userId: userData._id };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
