import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { ImageService } from './task/image.service';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI), MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
  controllers: [AppController, TaskController],
  providers: [AppService, ImageService, TaskService],
})
export class AppModule {}
