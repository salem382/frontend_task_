import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Access route information
  const isAuthenticated = localStorage.getItem('tasktoken');


  if (isAuthenticated) {

    
   return true; 

  } else {
    router.navigate(['/login']);
    return false;
  }
};
