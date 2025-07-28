import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./core/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'features',
        loadChildren: () => import('./features/features.routes').then(m => m.featuresRoutes)
    }
];


