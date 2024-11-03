import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFile } from '../entities/image-file.entity';

/**
 * Service to store the image files on the AWS S3 bucket.
 */
@Injectable()
export class ImageFilesService {
  constructor(
    @InjectRepository(ImageFile)
    private imageFileRepository: Repository<ImageFile>,
  ) {}

  saveImageFile(image: Express.MulterS3.File) {
    const img = new ImageFile();
    img.fileName = image.key;
    img.contentLength = image.size;
    img.contentType = image.mimetype;
    img.url = image.location;

    return this.imageFileRepository.save(img);
  }

  saveImageFiles(images: Express.MulterS3.File[]) {
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
