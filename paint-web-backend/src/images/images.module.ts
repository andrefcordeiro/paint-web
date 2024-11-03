import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageFile } from './entities/image-file.entity';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema } from './schemas/image.schema';
import { Image } from './entities/image.entity';
import { ImageFilesService } from './images-file/images-file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageFile]),
    UsersModule,
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ImageFilesService],
})
export class ImagesModule {}
