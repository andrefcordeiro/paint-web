import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ImageFilesService } from './images-file/images-file.service';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  /**
   * Máx number of uploads per user.
   */
  private readonly MAX_NUMBER_OF_UPLOADS = 5;

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
    await this.validateUserCanUploadImages(ownerId, 1);

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
   * Method that saves the image document on MongoDB.
   *
   * @param ownerId Id of the user uploading the image.
   * @param imageFile Object representing the image file saved locally.
   * @returns {Promise<Image>} Image document.
   */
  async saveImageLocally(ownerId: string, imageFile) {
    await this.validateUserCanUploadImages(ownerId, 1);

    const imagePath = `http://localhost:${process.env.PORT}/uploads/drawings/${imageFile.filename}`;
    try {
      const image: CreateImageDto = {
        url: imagePath,
        idS3BucketFile: 1,
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
    await this.validateUserCanUploadImages(ownerId, imageFiles.length);

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
   * Method that validates if a user can upload more images.
   * @param userId Id of the user uploading the images.
   * @param numOfNewImages Number of images to be uploaded.
   * @returns {Boolean} True if user can upload the images, false if not.
   */
  private async validateUserCanUploadImages(
    userId: string,
    numOfNewImages: number,
  ) {
    const numOfImagesUploaded = await this.imageModel.countDocuments({
      ownerId: new Types.ObjectId(userId),
    });

    if (numOfImagesUploaded + numOfNewImages > this.MAX_NUMBER_OF_UPLOADS) {
      throw new UnprocessableEntityException(
        `A user cannot upload more than ${this.MAX_NUMBER_OF_UPLOADS} images`,
      );
    }
  }

  /**
   * Method that finds all images uploaded by a specific user.
   *
   * @param userId Id of the user uploading the image.
   * @returns {Promise<Image[]>} Image documents.
   */
  findByUserId(userId: string): Promise<Image[]> {
    return this.imageModel.find({ ownerId: new Types.ObjectId(userId) });
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
