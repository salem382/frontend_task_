import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./core/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'features',
        canActivate: [authGuard], 
        loadChildren: () => import('./features/features.routes').then(m => m.featuresRoutes)
    }
];


