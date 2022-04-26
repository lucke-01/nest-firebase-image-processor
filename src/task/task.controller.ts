import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { imageFileFilter } from 'src/filters/image-filter';
import { CreateTaskDto } from './createTaskDto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getHello(): string {
    return this.taskService.getHello();
  }
  @Get(':taskId')
  getTask(@Param() params): string {
    return `task to find: ${params.taskId} not found`;
  }
  @Post()
  //file: is the name of file
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
  )
  uploadFile(@Req() req: any, @UploadedFile() file: Express.Multer.File, @Body() taskDto: CreateTaskDto) {
    console.log('file');
    console.log(file);

    console.log('taskDto');
    console.log(taskDto);
  }
}
