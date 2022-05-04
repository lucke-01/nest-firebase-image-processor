import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { ImageService } from '../task/image.service';
import { TaskController } from '../task/task.controller';
import { TaskService } from '../task/task.service';
import { Task, TaskSchema } from '../schemas/task.schema';
import { tasks } from '../test/tasks-mock';

/**
 * This approach we use database in memory
 */
describe('TaskService spec mongo in memory', () => {
  let taskService: TaskService;
  const numberTasks = tasks.length;
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let mongoDbURI : string;

  beforeAll(async () => {
    //SET UP MONGODB
    mongoServer = await MongoMemoryServer.create();
    mongoDbURI = mongoServer.getUri()+'tasks';

    //CREATE DATA IN DATABASE
    const con = await MongoClient.connect(mongoDbURI, {});
    const db = con.db(mongoServer.instanceInfo!.dbName);
    expect(db).toBeDefined();
    const col = db.collection('tasks');
    const result = await col.insertMany(tasks as any);
    expect(result.insertedCount).toStrictEqual(numberTasks);
    con.close();
    //SET UP APP
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongoDbURI),
      MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
      controllers: [AppController, TaskController],
      providers: [AppService, ImageService, TaskService]
    }).compile();
    app = moduleFixture.createNestApplication();
    //autovalidation
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    taskService = app.get<TaskService>(TaskService);
  });
  afterAll(async () => {
    //CLOSE SERVICES
    if (mongoServer) {
      await mongoServer.stop();
    }
    if (app) {
      await app.close();
    }
  });
  //TESTS
  it('findTaskByState', async () => {
    const taskCreated = await taskService.findTaskByState(Task.states.CREATED);
    const taskProcessing = await taskService.findTaskByState(Task.states.PROCCESING);
    const taskFinished = await taskService.findTaskByState(Task.states.FINISHED);
    const taskStateNotFound = await taskService.findTaskByState('notFound');

    expect(taskCreated).toHaveLength(3);
    expect(taskProcessing).toHaveLength(1);
    expect(taskFinished).toHaveLength(1);
    expect(taskStateNotFound).toHaveLength(0);

    const firstTaskCreatedSortByPriority = taskCreated[0];
    const firstTaskCreatedSortMockDB = tasks[2];
    expect(firstTaskCreatedSortByPriority.creationDate).toEqual(firstTaskCreatedSortMockDB.creationDate);
  });

});