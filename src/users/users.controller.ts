import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { ViewProfileDTO } from './dto/view-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/register')
  async registerUser(
    @Res() response,
    @Body() registerUserDTO: RegisterUserDTO,
  ) {
    try {
      const newUser = await this.userService.registerUser(registerUserDTO);
      return response.status(HttpStatus.CREATED).json({
        message: 'User has been registered successfully',
        newUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: `Error: User not created! - ${err}`,
        error: 'Bad Request',
      });
    }
  }

  @Post('/createProfile')
  async createProfile(
    @Res() response,
    @Body() createProfileDTO: CreateProfileDTO,
  ) {
    try {
      const newUser = await this.userService.createProfile(createProfileDTO);
      return response.status(HttpStatus.CREATED).json({
        message: 'User profile has been registered successfully',
        newUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: `Error: User profile not created! - ${err}`,
        error: 'Bad Request',
      });
    }
  }

  @Get('/getProfile')
  @UseGuards(AuthGuard())
  async getProfile(@Res() response, @Body() viewProfileDTO: ViewProfileDTO) {
    try {
      const userProfile = await this.userService.getProfile(viewProfileDTO);
      return response.status(HttpStatus.CREATED).json({
        message: 'Successfully fetched user profile',
        userProfile,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: `Error: Error fetching profile! - ${err}`,
        error: 'Bad Request',
      });
    }
  }

  @Post('/updateProfile')
  async updateProfile(
    @Res() response,
    @Body() updateProfileDTO: UpdateProfileDTO,
  ) {
    try {
      const newUser = await this.userService.updateProfile(updateProfileDTO);
      return response.status(HttpStatus.CREATED).json({
        message: 'User profile has been updated successfully',
        newUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: `Error: User profile not updated! - ${err}`,
        error: 'Bad Request',
      });
    }
  }
}
