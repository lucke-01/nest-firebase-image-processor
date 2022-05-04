import { Injectable } from '@nestjs/common';
import * as Jimp from 'jimp';
import * as CryptoJS from 'crypto-js';
import { Image } from '../schemas/image.schema';
import * as fileUtil from '../util/file-util';
import { Task } from '../schemas/task.schema';

@Injectable()
export class ImageService {
  constructor() {}

  async writeFileTask(image: Image, file: any): Promise<any> {
    return fileUtil.writeFile(process.env.PATH_IMAGES + '/' + image.filePath, file.buffer);
  }
  async generateImageSchema(taskId: string, file: any): Promise<Image> {
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
  async generateImageModifiedSchema(task: Task, originalImage: Image, buffer: any): Promise<Image> {
    const fileJimp = await Jimp.read(buffer);
    const fileJimpWidth = fileJimp.bitmap.width;
    const fileJimpHeight = fileJimp.bitmap.height;
    
    const md5File = CryptoJS.MD5(buffer).toString();

    const fileExtension = originalImage.filePath.split('.').pop();
    const fileName = task._id + '/' + fileJimpWidth + '/' + md5File + '.' + fileExtension;

    const image: Image = {
      md5: md5File,
      filePath: fileName,
      creationDate: new Date(),
      width: fileJimpWidth,
      height: fileJimpHeight,
      original: false
    };

    return image;
  }
}
