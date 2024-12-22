import { diskStorage } from 'multer';
import { join } from 'path';

import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Multer configuration for saving images locally.
 */
const uploadDir = join(process.cwd(), 'uploads');

const multerConfigLocal = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      let [filename, ext] = file.originalname.split('.');
      filename = `${filename}-${Date.now()}.${ext}`;

      if (!ext) {
        ext = file.mimetype.split('/').pop();
        filename = `${filename}.${ext}`;
      }

      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed...'), false);
    }
  },
};

export default multerConfigLocal;
