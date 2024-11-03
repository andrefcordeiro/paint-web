import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFile } from '../entities/image-file.entity';

/**
 * Service to store image files on the AWS S3 bucket.
 */
@Injectable()
export class ImageFilesService {
  constructor(
    @InjectRepository(ImageFile)
    private imageFileRepository: Repository<ImageFile>,
  ) {}

  /**
   * Method that stores a image file on the bucket.
   * @param image Image file.
   * @returns { Promise<ImageFile> } Image file.
   */
  saveImageFile(image: Express.MulterS3.File): Promise<ImageFile> {
    const img = new ImageFile();
    img.fileName = image.key;
    img.contentLength = image.size;
    img.contentType = image.mimetype;
    img.url = image.location;

    return this.imageFileRepository.save(img);
  }

  /**
   * Method that stores multiple image files on the bucket.
   * @param images List of image file.
   * @returns { Promise<ImageFile[]> } Image files.
   */
  saveImageFiles(images: Express.MulterS3.File[]): Promise<ImageFile[]> {
    const imgsArray = images.map((image) => {
      const img = new ImageFile();
      img.fileName = image.key;
      img.contentLength = image.size;
      img.contentType = image.mimetype;
      img.url = image.location;
      return img;
    });

    return this.imageFileRepository.save(imgsArray);
  }
}
