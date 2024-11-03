import { Types } from 'mongoose';

export class Image {
  id: Types.ObjectId;

  url: string;

  idS3BucketFile: number;

  ownerId: Types.ObjectId;
}
