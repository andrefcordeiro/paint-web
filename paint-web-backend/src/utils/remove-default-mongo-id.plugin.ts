import { Schema } from 'mongoose';

/**
 * Plugin craeted to remove default "_id" and "__v" MongoDB fields from a schema JSON.
 * @param schema Schema.
 */
export function RemoveDefaultMongoIdPlugin(schema: Schema) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
    },
  });
}
