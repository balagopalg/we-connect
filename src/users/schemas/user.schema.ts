import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: true, immutable: false, unique: true })
  username: string;

  @Prop()
  about: string;

  @Prop()
  interest: string;

  @Prop()
  gender: string;

  @Prop()
  dob: string;

  @Prop()
  password: string;

  @Prop()
  confirmPassword: string;
}

export const userSchema = SchemaFactory.createForClass(User);
