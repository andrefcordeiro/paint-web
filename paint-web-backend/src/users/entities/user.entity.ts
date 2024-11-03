import { Types } from 'mongoose';

export class User {
  id: Types.ObjectId;

  name: string;

  username: string;

  email: string;

  password: string;
}
