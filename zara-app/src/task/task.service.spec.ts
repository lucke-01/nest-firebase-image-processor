import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { MongooseModule } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';

import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { ImageService } from '../task/image.service';
import { TaskController } from '../task/task.controller';
import { TaskService } from '../task/task.service';
import { Task, TaskSchema } from '../schemas/task.schema';
import { tasks } from '../test/tasks-mock';
import { processedImagesResponses } from '../test/processed-images-mock';

/**
 * This approach we use database in memory
 */
describe('TaskService spec mongo in memory', () => {
  const clearOutputImageDir = true;
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
    //clear test/output-images dir
    if (clearOutputImageDir) {
      fsExtra.emptyDirSync('test/output-images/');
    }
  });
  //TESTS
  it('findTaskByState several states and state not found', async () => {
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
  it('findTaskByStates several states and state not found', async () => {
    const tasksToProcess = await taskService.findTaskByStates([Task.states.CREATED, Task.states.PROCCESING, Task.states.ERROR ]);
    const tasksFinished = await taskService.findTaskByStates([Task.states.FINISHED]);
    const tasksStateNotFound = await taskService.findTaskByStates(['notFound']);

    expect(tasksToProcess).toHaveLength(4);
    expect(tasksFinished).toHaveLength(1);
    expect(tasksStateNotFound).toHaveLength(0);

    const firstTaskCreatedSortByPriority = tasksToProcess[0];
    const firstTaskCreatedSortMockDB = tasks[2];
    expect(firstTaskCreatedSortByPriority.creationDate).toEqual(firstTaskCreatedSortMockDB.creationDate);
  });
  it('updateOne ', async () => {
    const modifiedObject = { message: 'updateOneTest' };
    const taskToUpdate = tasks[0];
    
    const updateState = await taskService.updateOne(taskToUpdate._id, modifiedObject);
    const updatedTaskFind = await taskService.findById(taskToUpdate._id);

    expect(updateState.modifiedCount).toEqual(1);
    expect(updatedTaskFind.message).toEqual(modifiedObject.message);

  });

  it('saveProcessedImages ', async () => {
    const taskToBeProcessed = tasks[0];
    const originalImage = taskToBeProcessed.images[0];
    const processedImages = processedImagesResponses[0];

    await taskService.saveProcessedImages(taskToBeProcessed, originalImage, processedImages);

    const taskProcessedDB = await taskService.findById(taskToBeProcessed._id);
    const taskProcessedImages = taskProcessedDB.images.filter(i => !i.original);

    //check if images have been created in DB
    expect(taskProcessedDB.images).toHaveLength(3);
    //check if images have been created
    for (const pi of taskProcessedImages) {
      const existsFileProcessed = fs.existsSync(process.env.PATH_IMAGES + '/' + pi.filePath);
      expect(existsFileProcessed).toBe(true);
    }

  });


});