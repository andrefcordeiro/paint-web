import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Req,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import multerConfig from './multer-config';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import multerConfigLocal from './multer-config-local';

/**
 * Images endpoints.
 */
@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly userService: UsersService,
  ) {}

  /**
   *  Save images on S3.
   *
   */
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadImage(
    @UploadedFile() image: Express.MulterS3.File,
    @Req() req: Request,
  ) {
    const user = await this.userService.findByUsername(req['user'].username);
    return this.imagesService.saveImage(user.id, image);
  }

  @Post('multiple')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }], multerConfig))
  async uploadMultipleImages(
    @UploadedFiles()
    images: Express.MulterS3.File[],
    @Req() req: Request,
  ) {
    const user = await this.userService.findByUsername(req['user'].username);
    return this.imagesService.saveImages(user.id, images);
  }

  /**
   *  Save images locally.
   *
   */
  // @Post()
  // @UseGuards(AuthGuard)
  // @UseInterceptors(FileInterceptor('image', multerConfigLocal))
  // async uploadImage(@UploadedFile() image, @Req() req: Request) {
  //   const user = await this.userService.findByUsername(req['user'].username);
  //   return this.imagesService.saveImageLocally(user.id, image);
  // }

  @Get()
  @UseGuards(AuthGuard)
  getImagesByUserId(@Query('user-id') userId: string) {
    return this.imagesService.findByUserId(userId);
  }

  @Delete(':imageId')
  @UseGuards(AuthGuard)
  async remove(@Param('imageId') imageId: string, @Req() req: Request) {
    const user = await this.userService.findByUsername(req['user'].username);
    return this.imagesService.remove(imageId, user.id);
  }
}
