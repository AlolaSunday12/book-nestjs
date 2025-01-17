import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './public/uploads',
    filename: (req, file, callback) => {
      // Generate a unique suffix based on the current timestamp and random number
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileExt = extname(file.originalname);
      const baseName = file.originalname.split('.')[0];
      const filename = `files-${baseName}-${uniqueSuffix}${fileExt}`;
      callback(null, filename);
    },
  }),
};
