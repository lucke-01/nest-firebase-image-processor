import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { CreateTaskDto } from './createTaskDto';
import * as fileUtil from '../util/file-util';
import { ImageService } from './image.service';
import { Image } from '../schemas/image.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>, private readonly imageService: ImageService) {}
  getHello(): string {
    return 'Tasks!';
  }
  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }
  async findById(id): Promise<Task> {
    //return this.taskModel.findOne({ identifier: id }).exec();
    return this.taskModel.findById(id).exec();
  }
  async deleteById(id): Promise<any> {
    return await this.taskModel.findByIdAndRemove(id);
  }
  async update(id, task: Task): Promise<Task> {
    return await this.taskModel.findByIdAndUpdate(id, task, { new: true });
  }
  async createTask(createTaskDto: CreateTaskDto, file: Express.Multer.File): Promise<Task> {
    const task = { ...createTaskDto, name: 'test', state: 'created', creationDate: new Date() };
    const createdTask = new this.taskModel(task);
    const savedTask = await createdTask.save();

    const taskId = savedTask._id.toString();
    const imageComplete: Image = await this.imageService.generateImageSchema(taskId, file);

    const savedTaskWithImages = { ...task, images: [imageComplete] };
    console.log(savedTaskWithImages);
    await this.update(taskId, savedTaskWithImages);

    this.imageService.writeFileTask(imageComplete, file);

    return savedTask;
  }
}
