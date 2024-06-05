import { Inject, Injectable } from '@nestjs/common';
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

  async userLogin(loginData: UserLoginDTO): Promise<{ accessToken: string }> {
    try {
      const { username, password } = loginData;
      if (!username || !password) {
        throw new Error('Invalid request');
      }
      const emailExist = await this.usersService._findUser(username, true);
      const usernameExist = await this.usersService._findUser(username, false);
      if (!emailExist && !usernameExist) {
        throw new Error('Invalid login credentials');
      }
      const userData = emailExist ? emailExist : usernameExist;
      const correctPasword = await bcrypt.compare(password, userData.password);
      if (!correctPasword) {
        throw new Error('Invalid login credentials');
      }
      const token = this.jwtService.sign({ id: userData._id });
      return { accessToken: token };
    } catch (err) {
      throw new Error(err);
    }
  }
}
