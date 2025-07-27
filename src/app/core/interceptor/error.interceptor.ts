import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpStatusCode, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { catchError, throwError, of } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const notificationService = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred.';
      const errorDetails: string[] = [];

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Specific HTTP status handling
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            notificationService.showMessage('danger', 'Unauthorized access.');
            router.navigateByUrl('/auth/login');
            break;
          case HttpStatusCode.Forbidden:
            notificationService.showMessage('danger', 'Access forbidden.');
            break;
          case HttpStatusCode.BadRequest:
            notificationService.showMessage('danger', error.error.message || errorMessage);
            break;
          case HttpStatusCode.InternalServerError:
            notificationService.showMessage('danger', 'Server error. Please try again later.');
            break;
          case 0:
            notificationService.showMessage('danger', 'Server error.');
            break;
        }

        // Server-side error
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Server Error: ${error.message || 'No message available'}`;
        }

        if (error.status === HttpStatusCode.NotFound) {
          const mockResponse = {
            totalCount: 0,
            totalPages: 0,
            pageSize: 0,
            currentPage: 0,
            data: null
          };
          return of(new HttpResponse({ body: mockResponse, status: error.status }));
        }
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};