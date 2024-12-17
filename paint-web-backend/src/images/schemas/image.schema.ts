import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RemoveDefaultMongoIdPlugin } from 'src/utils/remove-default-mongo-id.plugin';

export type ImageDocument = HydratedDocument<Image>;

@Schema({ timestamps: true })
export class Image {
  @Prop()
  url: string;

  @Prop()
  idS3BucketFile: number;

  @Prop({ type: Types.ObjectId })
  ownerId: Types.ObjectId;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

ImageSchema.plugin(RemoveDefaultMongoIdPlugin);
