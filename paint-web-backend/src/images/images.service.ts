import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ImageFilesService } from './images-file/images-file.service';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<Image>,
    private readonly imageFilesService: ImageFilesService,
  ) {}

  async saveImage(ownerId: string, imageFile: Express.MulterS3.File) {
    try {
      const imgSavedFile =
        await this.imageFilesService.saveImageFile(imageFile);

      const image: CreateImageDto = {
        url: imgSavedFile.url,
        idS3BucketFile: imgSavedFile.id,
        ownerId: new Types.ObjectId(ownerId),
      };
      const createdImage = new this.imageModel(image);

      return createdImage.save();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error while trying to save image: ' + error,
      );
    }
  }

  async saveImages(ownerId: string, imageFiles: Express.MulterS3.File[]) {
    try {
      const imgSavedFiles = await this.imageFilesService.saveImageFiles(
        imageFiles['images'],
      );

      const images: CreateImageDto[] = imgSavedFiles.map((imageFile) => {
        return {
          url: imageFile.url,
          idS3BucketFile: imageFile.id,
          ownerId: new Types.ObjectId(ownerId),
        };
      });

      return this.imageModel.insertMany(images);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error while trying to save images: ' + error,
      );
    }
  }

  findByUserId(userId: string) {
    return this.imageModel.find({ userId: new Types.ObjectId(userId) });
  }

  findOne(id: string) {
    return this.imageModel.findById(new Types.ObjectId(id)).exec();
  }

  async remove(id: string, userId: string) {
    const image = await this.findOne(id);

    if (!image) {
      throw new NotFoundException('Image does not exists');
    }

    if (image.ownerId.toString() !== userId) {
      throw new UnauthorizedException(
        `Image could not be deleted because the user is not it's owner.`,
      );
    }

    return this.imageModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
}
