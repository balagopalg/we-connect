import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { UserDocument } from '@users/schemas/user.schema';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';

/**
 * JWT authentication strategy for Passport.js in NestJS.
 * This strategy validates JWT tokens from incoming requests and retrieves user details from the database.
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { id: string }) {
    try {
      const { id } = payload;

      const user = await this.userModel.findById(id);

      if (!user) {
        throw new UnauthorizedException('Invalid token or user not found.');
      }

      return user;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized', err.message);
    }
  }
}
