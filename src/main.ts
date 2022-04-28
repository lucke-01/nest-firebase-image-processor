import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

console.log('IMPORTANT ENVIRONMENT');
console.log(process.env.PATH_IMAGES);
console.log(process.env.MONGODB_URI);

//require('dotenv-flow').config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //autovalidation
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
