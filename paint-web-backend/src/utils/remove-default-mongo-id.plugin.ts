import { Schema } from 'mongoose';

export function RemoveDefaultMongoIdPlugin(schema: Schema) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
    },
  });
}
