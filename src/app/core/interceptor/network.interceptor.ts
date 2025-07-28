import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export const networkInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);

  return next(req).pipe(
    retry(3), // Retry failed requests up to 3 times
    catchError((error: HttpErrorResponse) => {
      if (!navigator.onLine) {
        // Handle offline error
        alertService.showMessage('danger', 'No Internet Connection');
      }
      return throwError(() => error); // Rethrow the error
    })
  );
};