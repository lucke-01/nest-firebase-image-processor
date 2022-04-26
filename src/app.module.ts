import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';

@Module({
  imports: [MongooseModule.forRoot('mongodb://root:password@localhost/tasks'), MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
  controllers: [AppController, TaskController],
  providers: [AppService, TaskService],
})
export class AppModule {}
