// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../interface/user.interface';

@Schema({ _id: false })
class Interest {
  @Prop({ required: true })
  category: string;
}

@Schema({ _id: false })
class About {
  @Prop({ required: true })
  displayName: string;

  @Prop({ required: false })
  imageUrl?: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  birthday: string;

  @Prop({ required: false })
  horoscope?: string;

  @Prop({ required: false })
  zodiac?: string;

  @Prop({ required: false })
  height?: number;

  @Prop({ required: false })
  weight?: number;
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserDocument extends Document implements User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ type: About, required: true })
  about: About;

  @Prop({ type: [Interest], default: [] })
  interests: Interest[];

  @Prop()
  gender: string;

  @Prop()
  dob: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  confirmPassword: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.confirmPassword;
    return ret;
  },
});
