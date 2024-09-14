// features/feature-a/feature-a-routing.ts
import { Routes } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';

export const editorRoutes: Routes = [
  {
    path: '',
    component: EditorComponent,
  },
];
