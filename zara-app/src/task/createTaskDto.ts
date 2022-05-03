import { IsNumberString } from 'class-validator';

export class CreateTaskDto {
  @IsNumberString()
  priority: number;
}
