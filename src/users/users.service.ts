import { HoroscopeService } from '@horoscope/horoscope.service';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ViewProfileDTO } from './dto/view-profile.dto';
import { UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
    private readonly horoscopeService: HoroscopeService,
  ) {}

  /**
   * Registers a new user with the provided user data.
   * @param {RegisterUserDTO} userData - The user data to register.
   * @returns {Promise<string>} A message indicating successful registration.
   * @throws {BadRequestException} If username, password, email are missing, passwords don't match,
   *                               user email or username already exists, or any other registration error occurs.
   */
  async registerUser(userData: RegisterUserDTO): Promise<string> {
    try {
      const { username, password, email, confirmPassword } = userData;

      if (!username || !password || !email) {
        throw new BadRequestException(
          'Username, password, and email are required',
        );
      }

      if (password !== confirmPassword) {
        throw new BadRequestException("Passwords don't match");
      }

      const emailExists = await this.findUser(email, true);
      if (emailExists) {
        throw new BadRequestException('User email already exists');
      }

      const usernameExists = await this.findUser(username, false);
      if (usernameExists) {
        throw new BadRequestException('Username already exists');
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await this.userModel.create({
        username,
        password: hashedPassword,
        email,
      });

      return 'Successfully registered user';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Creates or updates a user profile with the provided profile data.
   * @param {CreateProfileDTO} profileData - The profile data to create or update.
   * @returns {Promise<any>} The updated user profile object.
   * @throws {BadRequestException} If userId is missing, height or weight is invalid,
   *                               or any other error occurs during profile creation or update.
   * @throws {NotFoundException} If the user with the specified userId is not found.
   */
  async createProfile(profileData: CreateProfileDTO): Promise<any> {
    const { about, interests, userId } = profileData;
    const { height, weight, birthday } = about;

    if (height !== undefined && height <= 0) {
      throw new BadRequestException('Height must be a positive number');
    }
    if (weight !== undefined && weight <= 0) {
      throw new BadRequestException('Weight must be a positive number');
    }
    const mappedInterests = interests.category.map((category: string) => ({
      category,
    }));

    if (birthday) {
      const horoscope = this.horoscopeService.getHoroscope(birthday);
      const zodiac = this.horoscopeService.getZodiac(birthday);
      if (horoscope) about.horoscope = horoscope;
      if (zodiac) about.zodiac = zodiac;
    }

    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $set: { about, interests: mappedInterests } },
        { new: true, select: '-password' },
      );

      return updatedUser;
    } catch (error) {
      throw new BadRequestException('Failed to update user profile');
    }
  }

  /**
   * Retrieves the profile of a user identified by userId.
   * @param {ViewProfileDTO} profileData - The profile data containing userId.
   * @returns {Promise<any>} The user profile object excluding the password.
   * @throws {BadRequestException} If userId is missing or invalid, or any other error occurs
   *                               during profile retrieval.
   * @throws {NotFoundException} If the user profile with the specified userId is not found.
   */
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

  /**
   * Updates the profile of a user identified by userId with the provided profile data.
   * @param {UpdateProfileDTO} profileData - The profile data containing userId, about, and interests.
   * @returns {Promise<any>} The updated user profile object.
   * @throws {BadRequestException} If userId is missing or invalid, or any other error occurs
   *                               during profile update.
   * @throws {NotFoundException} If the user profile with the specified userId is not found.
   */
  async updateProfile(profileData: UpdateProfileDTO): Promise<any> {
    const { userId, about, interests } = profileData;

    try {
      const userProfile = await this.userModel.findById(userId);

      if (!userProfile) {
        throw new NotFoundException('User profile not found');
      }

      if (about) {
        userProfile.about = about;
      }
      if (interests) {
        userProfile.interests = interests.category.map((category: string) => ({
          category,
        }));
      }

      const updatedProfile = await userProfile.save();
      return updatedProfile;
    } catch (error) {
      throw new BadRequestException('Failed to update user profile');
    }
  }

  /**
   * Finds a user document based on the search criteria.
   * @param {string} searchValue - The value to search for, either username or email.
   * @param {boolean} findByEmail - Flag indicating whether to search by email (true) or username (false).
   * @returns {Promise<UserDocument>} A promise that resolves with the found user document.
   * @throws {Error} If an error occurs during the database query.
   */
  async findUser(
    searchValue: string,
    findByEmail: boolean,
  ): Promise<UserDocument> {
    try {
      const query = findByEmail
        ? { email: searchValue }
        : { username: searchValue };
      const user = await this.userModel.findOne(query).exec();
      return user;
    } catch (error) {
      throw new Error('Error finding user');
    }
  }
}
