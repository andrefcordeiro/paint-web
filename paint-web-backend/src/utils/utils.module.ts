import { Module } from '@nestjs/common';
import { RemoveDefaultMongoIdPlugin } from './remove-default-mongo-id.plugin';

/**
 * Module with plugins and other common features to improve development.
 */
@Module({
  providers: [
    {
      provide: 'REMOVE_DEFAULT_MONGO_ID_PLUGIN',
      useValue: RemoveDefaultMongoIdPlugin,
    },
  ],
  exports: ['REMOVE_DEFAULT_MONGO_ID_PLUGIN'],
})
export class UtilsModule {}
