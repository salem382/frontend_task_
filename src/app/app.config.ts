import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptor/error.interceptor';
import { networkInterceptor } from './core/interceptor/network.interceptor';
import { loadingInterceptor } from './core/interceptor/loading.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
     provideHttpClient(
      withInterceptors([
        errorInterceptor, 
        networkInterceptor,
        loadingInterceptor
      ])
    ),
  ]
};

