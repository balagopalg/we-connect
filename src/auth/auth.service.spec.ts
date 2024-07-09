import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersService } from '@users/users.service';
import { AuthService } from './auth.service';
import { UserLoginDTO } from './dto/user-login.dto';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('userLogin', () => {
    it('should throw BadRequestException if email or password is missing', async () => {
      const loginData: UserLoginDTO = { email: '', password: 'password' };
      await expect(service.userLogin(loginData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if user is not found', async () => {
      const loginData: UserLoginDTO = {
        email: 'test@example.com',
        password: 'password',
      };
      jest.spyOn(usersService, 'findUser').mockResolvedValueOnce(null);
      await expect(service.userLogin(loginData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if password does not match', async () => {
      const loginData: UserLoginDTO = {
        email: 'test@example.com',
        password: 'password',
      };
      const salt = bcrypt.genSaltSync(10);
      const mockUserData = {
        _id: '1',
        password: await bcrypt.hashSync('password', salt),
      };
      jest
        .spyOn(usersService, 'findUser')
        .mockResolvedValueOnce(mockUserData as unknown as any);
      jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(false as unknown as never);
      await expect(service.userLogin(loginData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return accessToken and userId if login is successful', async () => {
      const loginData: UserLoginDTO = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockUserData = {
        _id: '1',
        password: await bcrypt.hash('password', 10),
      };
      const mockToken = 'mockAccessToken';
      jest
        .spyOn(usersService, 'findUser')
        .mockResolvedValueOnce(mockUserData as unknown as any);
      jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(true as unknown as never);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(mockToken);

      const result = await service.userLogin(loginData);
      expect(result.accessToken).toEqual(mockToken);
      expect(result.userId).toEqual(mockUserData._id);
    });
  });
});
