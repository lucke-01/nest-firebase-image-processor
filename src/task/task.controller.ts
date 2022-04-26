import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { imageFileFilter } from 'src/filters/image-filter';
import { CastErrorInterceptor } from 'src/interceptors/cast-error.interceptor';
import { Task } from 'src/schemas/task.schema';
import { CreateTaskDto } from './createTaskDto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('list')
  async findAll(): Promise<Task[]> {
    const tasks = await this.taskService.findAll();
    return tasks;
  }
  @Get(':taskId')
  @UseInterceptors(CastErrorInterceptor)
  async getTask(@Res() response, @Param() params) {
    const task = await this.taskService.findById(params.taskId);
    if (task == null) {
      return response.status(HttpStatus.NOT_FOUND).json({
        error: 'Not Found',
      });
    }
    return response.status(HttpStatus.OK).json({
      task,
    });
  }

  @Post()
  //file: is the name of file
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    })
  )
  uploadFile(@Req() req: any, @UploadedFile() file: Express.Multer.File, @Body() taskDto: CreateTaskDto) {
    console.log('file');
    console.log(file);

    console.log('taskDto');
    console.log(taskDto);

    this.taskService.createTask(taskDto, file);
  }
  @Delete('/:id')
  @UseInterceptors(CastErrorInterceptor)
  async delete(@Res() response, @Param('id') id) {
    const deletedTask = await this.taskService.deleteById(id);
    if (deletedTask == null) {
      return response.status(HttpStatus.NOT_FOUND).json({
        error: 'Not Found',
      });
    }
    return response.status(HttpStatus.OK).json({
      deletedTask,
    });
  }
  @Put('/:id')
  @UseInterceptors(CastErrorInterceptor)
  async update(@Res() response, @Param('id') id, @Body() task: Task) {
    const updatedTask = await this.taskService.update(id, task);
    if (updatedTask == null) {
      return response.status(HttpStatus.NOT_FOUND).json({
        error: 'Not Found',
      });
    }
    return response.status(HttpStatus.OK).json({
      updatedTask,
    });
  }
}
