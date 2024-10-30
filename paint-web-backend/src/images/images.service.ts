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
    const arquivo = new Image();
    arquivo.fileName = image.key;
    arquivo.contentLength = image.size;
    arquivo.contentType = image.mimetype;
    arquivo.url = image.location;

    return await this.fotoRepository.save(arquivo);
  }

  async salvarVariosDados(images: Express.MulterS3.File[]) {
    const arrayArquivos = images.map((image) => {
      const arquivo = new Image();
      arquivo.fileName = image.key;
      arquivo.contentLength = image.size;
      arquivo.contentType = image.mimetype;
      arquivo.url = image.location;
      return arquivo;
    });

    return await this.fotoRepository.save(arrayArquivos);
  }
}
