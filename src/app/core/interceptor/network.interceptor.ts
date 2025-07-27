import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  constructor(
    private alertService : AlertService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine) {
          retry(3), // Retry failed requests up to 3 times
          // Handle offline error
          this.alertService.showMessage('danger', 'No Internet Connection');
        }
        return throwError(() => error); // Rethrow the error
      })
    );
  }
}
