import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { imageFileFilter } from '../filters/image-filter';
import { Task } from '../schemas/task.schema';
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
  async getTask(@Res() response, @Param() params) {
    const task = await this.taskService.findById(params.taskId);
    if (task == null) {
      return response.status(HttpStatus.NOT_FOUND).json({
        data: 'Not Found',
      });
    }
    return response.status(HttpStatus.OK).json({
      data: task,
    });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    })
  )
  createTask(@Res() response, @Req() req: any, @UploadedFile() file: Express.Multer.File, @Body() taskDto: CreateTaskDto) {
    if (file == null) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        data: 'file required',
      });
    }

    this.taskService.createTask(taskDto, file);
    return response.status(HttpStatus.OK).json({
      data: taskDto,
    });
  }
  @Delete('/:id')
  async delete(@Res() response, @Param('id') id) {
    const deletedTask = await this.taskService.deleteById(id);
    if (deletedTask == null) {
      return response.status(HttpStatus.NOT_FOUND).json({
        data: 'Not Found',
      });
    }
    return response.status(HttpStatus.OK).json({
      data: deletedTask,
    });
  }
  @Put('/:id')
  async update(@Res() response, @Param('id') id, @Body() task: Task) {
    const updatedTask = await this.taskService.update(id, task);
    if (updatedTask == null) {
      return response.status(HttpStatus.NOT_FOUND).json({
        data: 'ID Not Found',
      });
    }
    return response.status(HttpStatus.OK).json({
      data: updatedTask,
    });
  }
}
