import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Image } from './image.schema';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  _id: string;
  @Prop()
  creationDate: Date;
  @Prop()
  priority: number;
  @Prop()
  state: string;
  @Prop()
  images: Image[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);