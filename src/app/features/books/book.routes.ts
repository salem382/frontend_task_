import { Routes } from '@angular/router';

export const bookRoutes: Routes = [
    {
        path: 'list',
        loadComponent: () => import('./booklist/booklist.component').then(m => m.BooklistComponent),
    },
    {
        path: 'add',
        loadComponent: () => import('./form/form.component').then(m => m.FormComponent),
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./form/form.component').then(m => m.FormComponent),
    }
];

