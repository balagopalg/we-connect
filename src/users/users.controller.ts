import {
  Controller,
  Post,
  Get,
  Res,
  Body,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ViewProfileDTO } from './dto/view-profile.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('api')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * Registers a new user.
   * @param response The HTTP response object.
   * @param registerUserDTO DTO containing user registration data.
   */
  @Post('/register')
  async registerUser(
    @Res() response,
    @Body() registerUserDTO: RegisterUserDTO,
  ) {
    try {
      const newUser = await this.userService.registerUser(registerUserDTO);
      return response.status(HttpStatus.CREATED).json({
        message: 'User has been registered successfully',
        user: newUser,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Error: User not created! - ${error.message}`,
        error: 'Bad Request',
      });
    }
  }

  /**
   * Creates a user profile.
   * @param response The HTTP response object.
   * @param createProfileDTO DTO containing profile creation data.
   */
  @Post('/createProfile')
  @UseGuards(AuthGuard())
  async createProfile(
    @Res() response,
    @Body() createProfileDTO: CreateProfileDTO,
  ) {
    try {
      const newProfile = await this.userService.createProfile(createProfileDTO);
      return response.status(HttpStatus.CREATED).json({
        message: 'User profile has been created successfully',
        profile: newProfile,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Error: User profile not created! - ${error.message}`,
        error: 'Bad Request',
      });
    }
  }

  /**
   * Retrieves a user profile.
   * @param response The HTTP response object.
   * @param viewProfileDTO DTO containing data to identify which profile to fetch.
   */
  @Get('/getProfile')
  @UseGuards(AuthGuard())
  async getProfile(@Res() response, @Body() viewProfileDTO: ViewProfileDTO) {
    try {
      const userProfile = await this.userService.getProfile(viewProfileDTO);
      return response.status(HttpStatus.OK).json({
        message: 'Successfully fetched user profile',
        profile: userProfile,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Error: Error fetching profile! - ${error.message}`,
        error: 'Bad Request',
      });
    }
  }

  /**
   * Updates a user profile.
   * @param response The HTTP response object.
   * @param updateProfileDTO DTO containing profile update data.
   */
  @Post('/updateProfile')
  @UseGuards(AuthGuard())
  async updateProfile(
    @Res() response,
    @Body() updateProfileDTO: UpdateProfileDTO,
  ) {
    try {
      const updatedProfile =
        await this.userService.updateProfile(updateProfileDTO);
      return response.status(HttpStatus.OK).json({
        message: 'User profile has been updated successfully',
        profile: updatedProfile,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Error: User profile not updated! - ${error.message}`,
        error: 'Bad Request',
      });
    }
  }
}
