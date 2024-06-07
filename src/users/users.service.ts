import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDTO } from './dto/register-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { ViewProfileDTO } from './dto/view-profile.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
  ) {}

  async registerUser(userData: RegisterUserDTO): Promise<any> {
    try {
      const { username, password, email, confirmPassword } = userData;
      if (!username || !password || !email) {
        throw new BadRequestException('Invalid request');
      }

      if (password !== confirmPassword) {
        throw new BadRequestException("Password doesn't match");
      }
      const emailExist = await this.findUser(email, true);
      if (emailExist) {
        throw new BadRequestException('User Email already exist');
      }

      const usernameExist = await this.findUser(username, false);
      if (usernameExist) {
        throw new BadRequestException('Username already exist');
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
      throw new BadRequestException(err);
    }
  }

  async createProfile(profileData: CreateProfileDTO): Promise<any> {
    const { about, interests, userId } = profileData;
    const { height, weight } = about;

    if (height !== undefined && height <= 0) {
      throw new BadRequestException('Height must be a positive number');
    }
    if (weight !== undefined && weight <= 0) {
      throw new BadRequestException('Weight must be a positive number');
    }
    const mappedInterests = interests.category.map((category: string) => ({
      category,
    }));

    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $set: { about, interests: mappedInterests } },
        { new: true },
      );

      return updatedUser;
    } catch (error) {
      throw new BadRequestException('Failed to update user profile');
    }
  }

  async getProfile(profileData: ViewProfileDTO): Promise<any> {
    const { userId } = profileData;
    if (!userId) {
      throw new BadRequestException('Invalid request');
    }
    try {
      const userProfile = await this.userModel
        .findById(userId)
        .select('-password')
        .exec();

      if (!userProfile) {
        throw new NotFoundException('User profile not found');
      }

      return userProfile;
    } catch (error) {
      throw new BadRequestException('Failed to fetch user profile');
    }
  }
  async updateProfile(profileData: UpdateProfileDTO): Promise<any> {
    const { userId, about, interests } = profileData;

    if (!userId) {
      throw new BadRequestException('Invalid request');
    }

    try {
      const userProfile = await this.userModel.findById(userId);

      if (!userProfile) {
        throw new NotFoundException('User profile not found');
      }

      if (about) {
        userProfile.about = about;
      }
      if (interests) {
        const mappedInterests = interests.category.map((category: string) => ({
          category,
        }));
        userProfile.interests = mappedInterests;
      }

      const updatedProfile = await userProfile.save();

      return updatedProfile;
    } catch (error) {
      throw new BadRequestException('Failed to update user profile');
    }
  }

  async findUser(searchValue: string, findByEmail: boolean): Promise<any> {
    let body = {};
    if (!findByEmail) body = { username: searchValue };
    else body = { email: searchValue };
    const user = await this.userModel.findOne(body).exec();
    return user;
  }
}
