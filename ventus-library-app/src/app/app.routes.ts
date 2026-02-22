import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full',
  },
  {
    path: 'books',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/books/books-list-page/books-list-page').then(
            (c) => c.BooksListPage
          ),
      },
    ],
  },
  {
    path: 'authors',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/authors/authors-list-page/authors-list-page').then(
            (c) => c.AuthorsListPage
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/not-found-page/not-found-page').then(
        (c) => c.NotFoundPage
      ),
  },
];
