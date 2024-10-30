import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private fotoRepository: Repository<Image>,
  ) {}

  async salvarDados(image: Express.MulterS3.File) {
    const img = new Image();
    img.fileName = image.key;
    img.contentLength = image.size;
    img.contentType = image.mimetype;
    img.url = image.location;

    return await this.fotoRepository.save(img);
  }

  async salvarVariosDados(images: Express.MulterS3.File[]) {
    const imgsArray = images.map((image) => {
      const img = new Image();
      img.fileName = image.key;
      img.contentLength = image.size;
      img.contentType = image.mimetype;
      img.url = image.location;
      return img;
    });

    return await this.fotoRepository.save(imgsArray);
  }
}
