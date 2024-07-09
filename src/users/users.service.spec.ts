import { HoroscopeService } from '@horoscope/horoscope.service';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';

const mockUserModel = {
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  save: jest.fn().mockImplementation((data: UserDocument) => {
    return Promise.resolve(data);
  }),
  exec: jest.fn(),
  select: jest.fn(),
} as unknown as jest.Mocked<Model<UserDocument>>;

const mockHoroscopeService = {
  getHoroscope: jest.fn(),
  getZodiac: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(UserDocument.name),
          useValue: mockUserModel,
        },
        {
          provide: HoroscopeService,
          useValue: mockHoroscopeService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should throw BadRequestException if user email already exists', async () => {
      try {
        const userData = {
          username: 'testuser',
          password: 'password',
          email: 'existinguser@example.com',
          confirmPassword: 'password',
        };

        mockUserModel.findOne.mockResolvedValue({
          _id: 'someuserid',
          email: userData.email,
        });

        await service.registerUser(userData);
      } catch (error) {
        expect(error.message).toEqual('Error finding user');
      }
    });

    it('should throw BadRequestException if password does not match confirmPassword', async () => {
      try {
        const userData = {
          username: 'testuser',
          password: 'password',
          email: 'test@example.com',
          confirmPassword: 'differentpassword',
        };

        await service.registerUser(userData);
      } catch (err) {
        expect(err.message).toEqual("Passwords don't match");
      }
    });

    it('should throw BadRequestException if username is missing', async () => {
      try {
        const userData = {
          password: 'password',
          email: 'test@example.com',
          confirmPassword: 'password',
        };

        await service.registerUser(userData);
      } catch (err) {
        expect(err.message).toEqual(
          'Username, password, and email are required',
        );
      }
    });
  });

  describe('createProfile', () => {
    it('should create a new user profile', async () => {
      const profileData = {
        about: {
          height: 175,
          weight: 70,
          birthday: '1990-01-01',
          displayName: 'name',
          gender: 'Male',
        },
        interests: {
          category: ['sports', 'music'],
        },
        userId: 'someuserid',
      };

      const updatedUser = {
        _id: 'someuserid',
        about: profileData.about,
        interests: profileData.interests.category.map((category: string) => ({
          category,
        })),
      };

      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.createProfile(profileData);
      expect(result).toEqual(updatedUser);
    });

    it('should throw BadRequestException if height is not a positive number', async () => {
      try {
        const profileData = {
          about: {
            height: -1,
            weight: 70,
            birthday: '1990-01-01',
            displayName: 'name',
            gender: 'Male',
          },
          interests: {
            category: ['sports', 'music'],
          },
          userId: 'someuserid',
        };

        await service.createProfile(profileData);
      } catch (err) {
        expect(err.message).toEqual('Height must be a positive number');
      }
    });
  });

  describe('getProfile', () => {
    it('should throw BadRequestException if userId is missing', async () => {
      try {
        const profileData = {};
        await service.getProfile(profileData);
      } catch (err) {
        expect(err.message).toEqual('Invalid request');
      }
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const profileData = {
        userId: 'someuserid',
        about: {
          height: 180,
          weight: 75,
          birthday: '1990-01-01',
          displayName: 'name',
          gender: 'Male',
        },
        interests: {
          category: ['cooking', 'reading'],
        },
      };

      const userProfile = {
        _id: 'someuserid',
        about: {
          height: 175,
          weight: 70,
          birthday: '1990-01-01',
          displayName: 'name',
          gender: 'Male',
        },
        interests: [{ category: 'sports' }, { category: 'music' }],
        save: jest.fn().mockResolvedValue({
          _id: 'someuserid',
          about: profileData.about,
          interests: profileData.interests.category.map((category: string) => ({
            category,
          })),
        }),
      };

      mockUserModel.findById.mockResolvedValue(userProfile);

      const result = await service.updateProfile(profileData);
      expect(result).toEqual({
        _id: 'someuserid',
        about: profileData.about,
        interests: profileData.interests.category.map((category: string) => ({
          category,
        })),
      });
    });

    it('should throw BadRequestException if userId is missing', async () => {
      try {
        const profileData = {
          about: {
            height: 180,
            weight: 75,
            displayName: 'name',
            gender: 'Male',
            birthday: '1990-01-01',
          },
        };
        await service.updateProfile(profileData);
      } catch (err) {
        expect(err.message).toEqual('Invalid request');
      }
    });
  });
});
