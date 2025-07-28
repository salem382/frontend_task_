import { Routes } from '@angular/router';

export const bookRoutes: Routes = [
    {
        path: 'list',
        loadComponent: () => import('./booklist/booklist.component').then(m => m.BooklistComponent),
    },
    {
        path: 'add',
        loadComponent: () => import('./bookform/bookform.component').then(m => m.BookformComponent),
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./bookform/bookform.component').then(m => m.BookformComponent),
    }
];

