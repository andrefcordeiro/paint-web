import { Injectable } from '@nestjs/common';
import { ImageFile } from './entities/image-file.entity';
import { Image } from './entities/image.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ImagesService {
  constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {}

  async saveImage(userId: string, imageFile: ImageFile) {
    const image = { url: imageFile.url, userId };
    const createdImage = new this.imageModel(image);
    return createdImage.save();
  }

  async saveImages(userId: string, imageFiles: ImageFile[]) {
    const images = imageFiles.map((imageFile) => {
      return { url: imageFile.url, userId };
    });
    return this.imageModel.insertMany(images);
  }
}
