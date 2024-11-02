import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import multerConfig from './multer-config';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { ImageFilesService } from './images-file/images-file.service';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly imageFilesService: ImageFilesService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadArquivo(
    @UploadedFile() image: Express.MulterS3.File,
    @Req() req: Request,
  ) {
    try {
      const imgSavedFile = await this.imageFilesService.saveImageFile(image);
      const user = await this.userService.findByUsername(req['user'].username);

      return this.imagesService.saveImage(user.id, imgSavedFile);
    } catch (error) {
      console.error(error);
    }
  }

  @Post('multiple')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }], multerConfig))
  async uploadVariosArquivos(
    @UploadedFiles()
    images: Express.MulterS3.File[],
    @Req() req: Request,
  ) {
    try {
      const imgSavedFiles = await this.imageFilesService.saveImageFiles(
        images['images'],
      );
      const user = await this.userService.findByUsername(req['user'].username);

      return this.imagesService.saveImages(user.id, imgSavedFiles);
    } catch (error) {
      console.error(error);
    }
  }
}
