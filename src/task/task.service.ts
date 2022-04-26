import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { CreateTaskDto } from './createTaskDto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}
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
    const image = { filePath: '', creationDate: new Date(), md5: 'generateMd5', width: 0, height: 0, original: true };
    const task = { ...createTaskDto, name: 'test', state: 'created', creationDate: new Date(), images: [image] };
    const createdTask = new this.taskModel(task);
    return createdTask.save();
  }
}
