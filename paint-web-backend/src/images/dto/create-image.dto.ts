import { Types } from 'mongoose';

export class CreateImageDto {
  url: string;

  idS3BucketFile: number;

  ownerId: Types.ObjectId;
}
