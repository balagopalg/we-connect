import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDTO } from './dto/register-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { ViewProfileDTO } from './dto/view-profile.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async registerUser(userData: RegisterUserDTO): Promise<any> {
    try {
      const { username, password, email, confirmPassword } = userData;
      if (!username || !password || !email) {
        throw new Error('Invalid request');
      }

      if (password !== confirmPassword) {
        throw new Error("Password doesn't match");
      }
      const emailExist = await this._findUser(email, true);
      if (emailExist) {
        throw new Error('User Email already exist');
      }

      const usernameExist = await this._findUser(username, false);
      if (usernameExist) {
        throw new Error('Username already exist');
      }

      const salt = bcrypt.genSaltSync(10);
      const createdUser = new this.userModel({
        username,
        password: await bcrypt.hashSync(password, salt),
        email,
      });
      await createdUser.save();
      return 'Successfully registered user Balagopal';
    } catch (err) {
      console.log('🚀🚀 ~ UsersService ~ registerUser ~ err---> ', err);
      throw new Error(err);
    }
  }

  async createProfile(profileData: CreateProfileDTO): Promise<any> {
    // const { username, password } = profileData;
    // if (!username || !password) {
    //   throw new Error('Invalid request');
    // }
  }

  async getProfile(profileData: ViewProfileDTO): Promise<any> {
    const { username, password } = profileData;
    if (!username || !password) {
      throw new Error('Invalid request');
    }
  }

  async updateProfile(profileData: UpdateProfileDTO): Promise<any> {
    // const { username, password } = profileData;
    // if (!username || !password) {
    //   throw new Error('Invalid request');
    // }
  }

  async _findUser(searchValue: string, findByEmail: boolean): Promise<any> {
    let body = {};
    if (!findByEmail) body = { username: searchValue };
    else body = { email: searchValue };
    const user = await this.userModel.findOne(body).exec();
    return user;
  }
}
