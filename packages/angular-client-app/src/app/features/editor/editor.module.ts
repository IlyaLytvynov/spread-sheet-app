import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';
import { editorRoutes } from './editor.route';
import { EditorComponent } from './components/editor/editor.component';

@NgModule({
  declarations: [EditorComponent],
  imports: [CommonModule],
  providers: [provideRouter(editorRoutes)],

})
export class EditorModule {}
