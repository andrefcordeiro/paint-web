import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Configuration to access AWS S3 bucket for storing images.
 */
const s3Config = new S3Client({
  region: process.env.AWS_S3_ACCESS_KEY_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

const multerConfig = {
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, image, cb) => {
      const imageName =
        path.parse(image.originalname).name.replace(/\s/g, '') + '-' + uuidv4();

      const extension = path.parse(image.originalname).ext;
      cb(null, `images/${imageName}${extension}`);
    },
  }),
};

export default multerConfig;
