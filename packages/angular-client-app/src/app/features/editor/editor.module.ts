import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';
import { editorRoutes } from './editor.route';
import { EditorComponent } from './components/editor';
import { CellComponent } from './components/cell';
import { TopBarComponent } from './components/top-bar';

@NgModule({
  declarations: [EditorComponent],
  imports: [CommonModule, CellComponent, TopBarComponent],
  providers: [provideRouter(editorRoutes)],

})
export class EditorModule {}
