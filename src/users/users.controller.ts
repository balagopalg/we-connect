import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { ViewProfileDTO } from './dto/view-profile.dto';
import { AuthGuard } from '@nestjs/passport';

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
      console.log('🚀🚀 ~ UsersController ~ err---> ', err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: `Error: User not created! - ${err}`,
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
      console.log('🚀🚀 ~ UsersController ~ err---> ', err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: `Error: Error fetching profile! - ${err}`,
        error: 'Bad Request',
      });
    }
  }
}
