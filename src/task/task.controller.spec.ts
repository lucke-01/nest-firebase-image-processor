import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ImageService } from './image.service';
import { Task, TaskDocument, TaskSchema } from '../schemas/task.schema';
import { tasks } from '../test/tasks-mock';

/**
 * This approach we use spy to mock taskModel instead of database in memory
 */
describe('TaskController Spy', () => {
  let taskController: TaskController;
  let mockTaskModel: Model<TaskDocument>;
  const response = {
    json: jest.fn(),
    status: (status) => {return {json: (data) => {return data;} }},
  }

  beforeAll(async () => {
    const taskModel = mongoose.model('Task', TaskSchema);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService, ImageService, 
        { 
          provide: getModelToken(Task.name), 
          useValue: taskModel  // <-- Use the Model Class from Mongoose
      }
    ],
    }).compile();
    mockTaskModel = app.get<Model<TaskDocument>>(getModelToken(Task.name));
    taskController = app.get<TaskController>(TaskController);
  });

  describe('root', () => {
    it('taskController.findAll() -> should return list of tasks"', async () => {
      const taskListMock = [{_id: '1'},{_id: '2'}];
      //mock find
      const spy = jest
        .spyOn(mockTaskModel, 'find') // <- spy on what you want
        .mockResolvedValue(taskListMock); // <- Set your resolved value

      const allTask = await taskController.findAll();
      expect(allTask).toHaveLength(taskListMock.length);
    });

    it('taskController.getTask() -> should return specific task"', async () => {
      const spy = jest
        .spyOn(mockTaskModel, 'findById')
        .mockResolvedValue(tasks[0]);
      const params = {taskId: tasks[0]._id};
      const responseGetTask = await taskController.getTask(response, params);
      expect(responseGetTask.data).toBe(tasks[0]);
    });
    it('taskController.createTask() -> should return specific task"', async () => {
      //needed to mock on prototype for save method
      const spy = jest
        .spyOn(mockTaskModel.prototype, 'save')
        .mockResolvedValue(tasks[0]);
      
      const taskDto = {priority: 3};
      const file: Express.Multer.File = null;
      const responseCreateTask = await taskController.createTask(response,null, file, taskDto);
      //bad request not file
      expect(responseCreateTask.data).toBe('file required');
    });
    it('taskController.delete() -> should delete specific task"', async () => {
      const spy = jest
        .spyOn(mockTaskModel, 'findByIdAndRemove')
        .mockResolvedValue(tasks[0]);
      const id = tasks[0]._id;
      const responseDeleteTask = await taskController.delete(response, id);

      expect(responseDeleteTask.data).toBe(tasks[0]);
    });
    
    it('taskController.update() -> should update specific task"', async () => {
      const spy = jest
        .spyOn(mockTaskModel, 'findByIdAndUpdate')
        .mockResolvedValue(tasks[0]);
      const id = tasks[0]._id;
      const responseGetTask = await taskController.update(response,id, tasks[0]);

      expect(responseGetTask.data).toBe(tasks[0]);
    });

  });
});