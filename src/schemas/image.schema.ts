import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  static mainDir = 'output';
  @Prop()
  md5: string;
  @Prop()
  filePath: string;

  @Prop()
  creationDate: Date;

  @Prop()
  width: number;

  @Prop()
  height: number;
  @Prop()
  original: boolean;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
