import { Controller, Get, Param } from '@nestjs/common';
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
    //return this.taskService.getHello();
  }
}
