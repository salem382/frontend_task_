import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('mshaerToken');
    const trapsToken = localStorage.getItem('trap_token');
    if (token && req.url.includes('mshaer.co4qu.com'))  {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(clonedReq);
    }
    else if (trapsToken && !req.url.includes('mshaer.co4qu.com')) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${trapsToken}`)
      });
      return next.handle(clonedReq);
    }
    return next.handle(req);
  }
}