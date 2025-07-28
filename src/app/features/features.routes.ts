import { Routes } from '@angular/router';

export const featuresRoutes: Routes = [
    {
        path: 'book',
        loadChildren: () => import('./books/book.routes').then(m => m.bookRoutes)
    }
];
