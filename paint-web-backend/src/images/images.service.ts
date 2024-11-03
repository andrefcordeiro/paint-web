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

  /**
   * Method that saves the image document on MongoDB and calls the imageFilesService to store the image file on the S3 Bucket.
   *
   * @param ownerId Id of the user uploading the image.
   * @param imageFile Object representing the image file to be store on the S3 Bucket.
   * @returns {Promise<Image>} Image document.
   */
  async saveImage(
    ownerId: string,
    imageFile: Express.MulterS3.File,
  ): Promise<Image> {
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

  /**
   * Method that saves multiple image documents on MongoDB and calls the imageFilesService to store the images files on the S3 Bucket.
   *
   * @param ownerId Id of the user uploading the images.
   * @param imageFile Object representing the images files to be store on the S3 Bucket.
   * @returns {Promise<Image[]>} Image documents.
   */
  async saveImages(
    ownerId: string,
    imageFiles: Express.MulterS3.File[],
  ): Promise<Image[]> {
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

  /**
   * Method that find all images uploaded by a specific user.
   *
   * @param userId Id of the user uploading the image.
   * @returns {Promise<Image[]>} Image documents.
   */
  findByUserId(userId: string): Promise<Image[]> {
    return this.imageModel.find({ userId: new Types.ObjectId(userId) });
  }

  /**
   * Method that returns a image document by it's id.
   *
   * @param id Id of the image document.
   * @returns {Promise<Image[]>} Image document.
   */
  findOne(id: string): Promise<Image> {
    return this.imageModel.findById(new Types.ObjectId(id)).exec();
  }

  /**
   * Method that removes a image document by it's id.
   *
   * @param id Id of the image document.
   * @param userId Id of the user calling this operation.
   * @returns {Promise<Image>}
   */
  async remove(id: string, userId: string): Promise<Image> {
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
