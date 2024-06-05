import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserLoginDTO } from 'src/auth/dto/user-login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async userLogin(@Res() response, @Body() userLoginDTO: UserLoginDTO) {
    try {
      const newUser = await this.authService.userLogin(userLoginDTO);
      return response.status(HttpStatus.CREATED).json({
        message: 'User has been successfully logged in',
        newUser,
      });
    } catch (err) {
      console.log('🚀🚀 ~ UsersController ~ err---> ', err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: `Error: Failed to Login! - ${err}`,
        error: 'Bad Request',
      });
    }
  }
}
