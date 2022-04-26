import { CallHandler, ExecutionContext, NestInterceptor, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

import { catchError, Observable } from 'rxjs';

export class CastErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof mongoose.Error.CastError) {
          throw new NotFoundException(error.message);
        } else {
          throw error;
        }
      })
    );
  }
}
