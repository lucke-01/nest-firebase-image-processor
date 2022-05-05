import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { CreateTaskDto } from './createTaskDto';
import * as mongoose from 'mongoose';
import { ImageService } from './image.service';
import { Image } from '../schemas/image.schema';
import * as fileUtil from '../util/file-util';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>, private readonly imageService: ImageService) {}
  async findAll(): Promise<Task[]> {
    return this.taskModel.find();
  }
  async findById(id): Promise<Task> {
    return this.taskModel.findById(id);
  }
  async deleteById(id): Promise<any> {
    return await this.taskModel.findByIdAndRemove(id);
  }
  async update(id, task: Task): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(id, task, { new: true });
  }
  async createTask(createTaskDto: CreateTaskDto, file: any): Promise<Task> {
    const taskId = new mongoose.Types.ObjectId();
    const taskIdString = taskId.toString();
    //generate image
    const imageComplete: Image = await this.imageService.generateImageSchema(taskIdString, file);
    //save task
    const task = { ...createTaskDto, _id: taskId, state: Task.states.CREATED, creationDate: new Date(), images: [imageComplete] };
    const createdTask = new this.taskModel(task);
    const savedTask = await createdTask.save();
    //write file image
    this.imageService.writeFileTask(imageComplete, file);

    return savedTask;
  }
  async findTaskByState(state: string): Promise<Task[]> {
    return await this.taskModel.find({ 'state': state }).sort([['priority', -1], ['creationDate', 1]]);
  }
  async findTaskByStates(states: string[]): Promise<Task[]> {
    return await this.taskModel.find().where('state').in(states).sort([['priority', -1], ['creationDate', 1]]);
  }
  async updateOne(id, task: any) {
    const res = await this.taskModel.updateOne({ _id: id }, task);
    return res;
    /*res.matchedCount; // Number of documents matched
    res.modifiedCount; // Number of documents modified
    res.acknowledged; // Boolean indicating everything went smoothly.
    res.upsertedId; // null or an id containing a document that had to be upserted.
    res.upsertedCount; // Number indicating how many documents had to be upserted. Will either be 0 or 1.*/

    /*const taskDB : Task = await this.findById(id);
    console.log("UPDATEE TASK");
    console.log({...taskDB, ...task});
    return await this.update(id, {...taskDB, ...task});*/
  }
  async saveProcessedImages(task : Task, originalImage: Image, processedImages) {
    const imagesModified : Image[] = [];
    
    for (const pi of processedImages) {
      const contentBuffer = Buffer.from(pi.buffer, 'base64');

      const imageModified: Image = await this.imageService.generateImageModifiedSchema(task, originalImage, contentBuffer);

      //write file image
      fileUtil.writeFile(process.env.PATH_IMAGES + '/' + imageModified.filePath, contentBuffer)

      imagesModified.push(imageModified);
    }
    imagesModified.push(originalImage);
    //update task
    console.log('task');
    console.log(task);
    this.updateOne(task._id, {state: Task.states.FINISHED,images: imagesModified });

    console.log('imagesModified');
    console.log(imagesModified);
  }
}
