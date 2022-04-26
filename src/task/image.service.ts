import { Injectable } from '@nestjs/common';
import * as fileUtil from '../util/file-util';
import * as Jimp from 'jimp';
import * as CryptoJS from 'crypto-js';
import { Image } from '../schemas/image.schema';

@Injectable()
export class ImageService {
  constructor() {}

  async writeFileTask(image: Image, file: Express.Multer.File): Promise<any> {
    return fileUtil.writeFile(Image.mainDir + '/' + image.filePath, file.buffer);
  }
  async generateImageSchema(taskId: string, file: Express.Multer.File): Promise<Image> {
    const fileJimp = await Jimp.read(file.buffer);
    const fileJimpWidth = fileJimp.bitmap.width;
    const fileJimpHeight = fileJimp.bitmap.height;
    
    const md5File = CryptoJS.MD5(file.buffer).toString();

    const fileExtension = file.originalname.split('.').pop();
    const fileName = taskId + '/' + fileJimpWidth + '/' + md5File + '.' + fileExtension;

    const image: Image = {
      md5: md5File,
      filePath: fileName,
      creationDate: new Date(),
      width: fileJimpWidth,
      height: fileJimpHeight,
      original: true,
    };

    return image;
  }
}
