import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import multerConfig from './multer-config';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  uploadArquivo(@UploadedFile() image: Express.MulterS3.File) {
    console.log(image);
    return this.imagesService.salvarDados(image);
  }

  @Post('multiple')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }], multerConfig))
  async uploadVariosArquivos(
    @UploadedFiles()
    images: Express.MulterS3.File[],
  ) {
    return await this.imagesService.salvarVariosDados(images['images']);
  }
}
