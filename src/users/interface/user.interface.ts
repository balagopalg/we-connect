// src/users/interfaces/user.interface.ts
import { Document } from 'mongoose';

export interface Interest {
  category: string;
}

export interface About {
  displayName: string;

  imageUrl?: string;

  gender: string;

  birthday: string;

  horoscope?: string;

  zodiac?: string;

  height?: number;

  weight?: number;
}

export interface User extends Document {
  email: string;
  name?: string;
  username: string;
  about?: About;
  interests: Interest[];
  password: string;
  confirmPassword: string;
}
