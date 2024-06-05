export interface IUser extends Document {
  readonly username: string;
  readonly email: number;
  readonly password: number;
  readonly gender: string;
  readonly marks: number;
}
