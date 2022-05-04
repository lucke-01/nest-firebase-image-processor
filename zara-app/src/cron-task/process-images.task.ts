import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout  } from '@nestjs/schedule';
import * as fs from 'fs';
import axios from 'axios';
import { Task } from '../schemas/task.schema';
import { TaskService } from '../task/task.service';
import { Image } from '../schemas/image.schema';
import * as FormData from 'form-data'
import {Blob} from 'node:buffer';

@Injectable()
export class ProcessImageTaskService {
  private readonly logger = new Logger(ProcessImageTaskService.name);
  
  constructor(private readonly taskService: TaskService) {}

  // Called when the current second is 30
  //@Cron(CronExpression.EVERY_30_SECONDS)
  // called once one second after app runs
  @Timeout(1*1000)
  handleCron() {
    this.logger.debug('CRON ProcessImageTaskService STARTED');
    try {
        this.processImagesResize();
    } catch (err) {
        this.logger.error('CRON ProcessImageTaskService FAILED: '+err);
    }

    this.logger.debug('CRON ProcessImageTaskService FINISHED');
  }

  async processImagesResize() {
    const createdTasks : Task[] = await this.taskService.findTaskByStates([Task.states.CREATED, Task.states.PROCCESING ]);
    this.logger.debug('createdTasks' + createdTasks);

    createdTasks.forEach(task => {
        this.processImageResize(task);
    });
  }
  async processImageResize(task : Task) {
    const taskDB = await this.taskService.findById(task._id);
    taskDB.state = Task.states.PROCCESING;
    this.taskService.update(task._id, taskDB);
    try {
        const originalImage : Image = task.images.find(img => img.original);
        this.logger.debug('originalImage');
        this.logger.debug(originalImage);
        const originalImageFilePath : string = process.env.PATH_IMAGES +"/"+ originalImage.filePath;

        const imageStream = fs.createReadStream(originalImageFilePath);
        // send original image to google cloud functions to get this same image in differents sizes
        const formData = new FormData();
        formData.append('file', imageStream);
        axios.post(process.env.FIREBASE_FUNCTIONS_URL+'/file-process/resize-file', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            const processedImages = res.data.data;
            this.logger.debug('response: '+res);
            this.taskService.saveProcessedImages(task, originalImage, processedImages);
        }).catch(err => {
            this.logger.error('ERROR: '+err);
        });
    } catch (err) {
        taskDB.state = Task.states.FINISHED;
        this.taskService.update(task._id, taskDB);
    }
  }
}
