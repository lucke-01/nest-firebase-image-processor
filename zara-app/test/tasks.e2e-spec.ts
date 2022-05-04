import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { ImageService } from '../src/task/image.service';
import { TaskController } from '../src/task/task.controller';
import { TaskService } from '../src/task/task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../src/schemas/task.schema';
import { tasks } from '../src/test/tasks-mock';
import * as fsExtra from 'fs-extra';

describe('TaskController (e2e)', () => {
  const clearOutputImageDir = true;
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

  it('OK /task/list (GET)', () => {
    return request(app.getHttpServer())
      .get('/task/list')
      .expect(200)
      .then(response => {
        const tasksResponse = response.body;
        expect(tasksResponse.length).toBe(numberTasks)
      });
  });
  it('[OK] /task/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/task/' + tasks[0]._id)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const task = response.body.data;
        expect(task._id).toBe(tasks[0]._id)
      })
  });
  it('[NO VALID ID] /task/:id (GET)', () => {
    //invalid id
    return request(app.getHttpServer())
      .get('/task/' + 'notvalidid')
      .expect(404)
      .expect('Content-Type', /json/);
  });
  it('[NOT FOUND ID] /task/:id (GET)', () => {
    //valid id but not found
    return request(app.getHttpServer())
      .get('/task/' + '507f1f77bcf86cd799439011')
      .expect(404)
      .expect('Content-Type', /json/);
  });
  it('[OK] /task/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/task/' + tasks[0]._id)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const task = response.body.data;
        expect(task._id).toBe(tasks[0]._id)
        //check if there are one task less
        return request(app.getHttpServer())
          .get('/task/list')
          .expect(200)
          .then(response => {
            const tasksResponse = response.body;
            expect(tasksResponse.length).toBe(numberTasks-1)
          });
      })
  });
  it('[NOT FOUND ID] /task/:id (DELETE)', () => {
    //valid id but not found
    return request(app.getHttpServer())
      .delete('/task/' + '507f1f77bcf86cd799439011')
      .expect(404)
      .expect('Content-Type', /json/);
  });

  it('[OK] /task/:id (PUT)', () => {
    const taskModified = {...tasks[1],priority: 0};
    return request(app.getHttpServer())
      .put('/task/' + tasks[1]._id)
      .send(taskModified)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const taskResponse = response.body.data;
        expect(taskResponse.priority).toBe(0)
      })
  });
  it('[NOT FOUND] /task/:id (PUT)', () => {
    const taskModified = {...tasks[1],priority: 0};
    return request(app.getHttpServer())
      .put('/task/' + 'notfoundid')
      .send(taskModified)
      .expect(404)
      .expect('Content-Type', /json/)
  });

  it('[OK] /task/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/task/')  
      .set('Connection', 'keep alive')
      .set('Content-Type', 'multipart/form-data')
      .field('priority', '4')
      .attach('file', __dirname + '/resources/example-images/testImage.jpg')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const taskResponse = response.body.data;
        expect(taskResponse.priority).toBe('4')
      })
  });
  it('[NOT FILE] /task/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/task/')  
      .set('Connection', 'keep alive')
      .set('Content-Type', 'multipart/form-data')
      .field('priority', '4')
      .attach('file', null)
      .expect(400)
      .expect('Content-Type', /json/)
      .expect({ data: 'file required'});
  });
  it('[BAD FILE] /task/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/task/')
      .set('Connection', 'keep alive')
      .set('Content-Type', 'multipart/form-data')
      .field('priority', '4')
      .attach('file', __dirname + '/resources/example-images/test.pdf')
      .expect(400)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.message).toBe('Only image files are allowed!')
      });
  });
  it('[bad body] /task/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/task/')  
      .set('Connection', 'keep alive')
      .set('Content-Type', 'multipart/form-data')
      .field('priority', 'BADVALUE')
      .attach('file', __dirname + '/resources/example-images/testImage.jpg')
      .expect(400)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.message[0]).toBe('priority must be a number string')
      });
  });
  it('[bad body and file] /task/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/task/')  
      .set('Connection', 'keep alive')
      .set('Content-Type', 'multipart/form-data')
      .field('priority', 'BADVALUE')
      .attach('file', null)
      .expect(400)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.message[0]).toBe('priority must be a number string')
      });
  });

});