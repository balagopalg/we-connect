import { Controller, Post, Res, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO } from './dto/user-login.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user login request.
   * @param res The HTTP response object.
   * @param userLoginDTO DTO containing user login data (email and password).
   * @returns A JSON response indicating successful user login with status 201.
   * @throws Returns a JSON response with status 400 if login fails due to invalid credentials or other errors.
   */
  @ApiTags('Authorization')
  @Post('/login')
  async userLogin(@Res() res, @Body() userLoginDTO: UserLoginDTO) {
    try {
      const newUser = await this.authService.userLogin(userLoginDTO);
      return res.status(HttpStatus.CREATED).json({
        message: 'User has been successfully logged in',
        user: newUser,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Error: Failed to login - ${err.message}`,
        error: 'Bad Request',
      });
    }
  }
}
