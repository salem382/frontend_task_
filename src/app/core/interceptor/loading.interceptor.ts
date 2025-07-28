import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Show loading indicator
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Hide loading indicator when request completes (success or error)
      loadingService.hide();
    })
  );
};
