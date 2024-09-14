import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'editor',
    loadChildren: () =>
      import('./features/editor/editor.module').then(
        (m) => m.EditorModule
      ),
  },
];
