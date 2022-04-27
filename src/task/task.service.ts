import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { CreateTaskDto } from './createTaskDto';
import * as mongoose from 'mongoose';
import { ImageService } from './image.service';
import { Image } from '../schemas/image.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>, private readonly imageService: ImageService) {}
  getHello(): string {
    return 'Tasks!';
  }
  async findAll(): Promise<Task[]> {
    return this.taskModel.find();
  }
  async findById(id): Promise<Task> {
    //return this.taskModel.findOne({ identifier: id }).exec();
    return this.taskModel.findById(id);
  }
  async deleteById(id): Promise<any> {
    return await this.taskModel.findByIdAndRemove(id);
  }
  async update(id, task: Task): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(id, task, { new: true });
  }
  async createTask(createTaskDto: CreateTaskDto, file: Express.Multer.File): Promise<Task> {
    const taskId = new mongoose.Types.ObjectId();
    const taskIdString = taskId.toString();
    //generate image
    const imageComplete: Image = await this.imageService.generateImageSchema(taskIdString, file);
    //save task
    const task = { ...createTaskDto, _id: taskId, name: 'test', state: 'created', creationDate: new Date(), images: [imageComplete] };
    const createdTask = new this.taskModel(task);
    const savedTask = await createdTask.save();
    //write file image
    this.imageService.writeFileTask(imageComplete, file);

    return savedTask;
  }
}
