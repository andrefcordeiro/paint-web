import { Test, TestingModule } from '@nestjs/testing';
import { ImageFilesService } from './images-file.service';

describe('ImageFilesService', () => {
  let service: ImageFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageFilesService],
    }).compile();

    service = module.get<ImageFilesService>(ImageFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
