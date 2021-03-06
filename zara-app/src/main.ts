import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

console.log('process.env.MONGODB_URI');
console.log(process.env.MONGODB_URI);

console.log('process.env.FIREBASE_FUNCTIONS_URL');
console.log(process.env.FIREBASE_FUNCTIONS_URL);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //autovalidation
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
