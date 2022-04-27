import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

import { AppModule } from './../src/app.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { ImageService } from '../src/task/image.service';
import { TaskController } from '../src/task/task.controller';
import { TaskService } from '../src/task/task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../src/schemas/task.schema';
import { tasks } from '../src/test/tasks-mock';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let mongoDbURI : string;

  beforeAll(async () => {
    // This will create an new instance of "MongoMemoryServer" and automatically start it
    mongoServer = await MongoMemoryServer.create();
    mongoDbURI = mongoServer.getUri()+'tasks';

    const con = await MongoClient.connect(mongoDbURI, {});
    const db = con.db(mongoServer.instanceInfo!.dbName);
    
    db.dropCollection('tasks');

    expect(db).toBeDefined();
    const col = db.collection('tasks');
    const result = await col.insertMany(tasks as any);
    expect(result.insertedCount).toStrictEqual(2);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule,MongooseModule.forRoot(mongoDbURI), MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
      controllers: [AppController, TaskController],
      providers: [AppService, ImageService, TaskService]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

  });
  afterAll(async () => {
    if (mongoServer) {
      await mongoServer.stop();
    }
    await app.close();
  });

  beforeEach(async () => {
    
  });

  it('/task/list (GET)', () => {
    return request(app.getHttpServer())
      .get('/task/list')
      .expect(200)
      .expect('Hello World!');
  });
});
/*
agent.post('/pictures')
     .set('Connection', 'keep alive')
     .set('Content-Type', 'application/x-www-form-urlencoded')
     .field('picTitle', 'Picture Title')
     .field('tags[0][name]', tags[0].name)
     .field('tags[1][name]', tags[1].name)
     .field('tags[2][name]', tags[2].name)
     .attach('file', __dirname + '/img/noel.jpg')
     .end(function(pictureSaveErr, pictureSaveRes) {
         //do stuff
     }
*/
//TODO: THIS
/*
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { CatsModule } from '../../src/cats/cats.module';
import { CatsService } from '../../src/cats/cats.service';
import { INestApplication } from '@nestjs/common';

describe('Cats', () => {
  let app: INestApplication;
  let catsService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect({
        data: catsService.findAll(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
*/