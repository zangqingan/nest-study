import { BadRequestException } from '@nestjs/common';
import * as multer from 'multer';
import * as fs from 'fs';

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadPath = 'uploads/';
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    } catch (error) {
      throw new BadRequestException('创建上传目录失败');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
});
