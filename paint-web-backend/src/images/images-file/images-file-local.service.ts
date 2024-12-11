import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

/**
 * Service to store image files locally.
 */
@Injectable()
export class ImageFilesServiceLocal {
  constructor() {}

  /**
   * Method that stores a image file.
   * @param image Image file.
   * @returns { Promise<ImageFile> } Image file.
   */
  saveImageFile(image: Express.MulterS3.File) {
    console.log('🚀 ~ ImageFilesServiceLocal ~ saveImageFile ~ image:', image);
  }

  // /**
  //  * Method that stores multiple image files.
  //  * @param images List of image file.
  //  * @returns { Promise<ImageFile[]> } Image files.
  //  */
  // saveImageFiles(images: Express.MulterS3.File[]): Promise<ImageFile[]> {
  //   const imgsArray = images.map((image) => {
  //     const img = new ImageFile();
  //     img.fileName = image.key;
  //     img.contentLength = image.size;
  //     img.contentType = image.mimetype;
  //     img.url = image.location;
  //     return img;
  //   });

  //   return this.imageFileRepository.save(imgsArray);
  // }
}
