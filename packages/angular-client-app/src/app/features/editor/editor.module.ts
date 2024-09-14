import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';
import { editorRoutes } from './editor.route';
import { SpreadsheetComponent } from '@app/shared/components/spreadsheet/spreadsheet.component';
import { EditorComponent } from './components/editor/editor.component';

@NgModule({
  declarations: [EditorComponent],
  imports: [CommonModule, SpreadsheetComponent],
  providers: [provideRouter(editorRoutes)],

})
export class EditorModule {}
