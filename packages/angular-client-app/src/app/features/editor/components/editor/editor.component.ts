import { Component, computed, inject } from '@angular/core';
import { SpreadsheetStore } from '../../editor.store';

@Component({
  selector: 'app-editor',
  template: `
      <h2>{{ workbook().name }}</h2>
      <div *ngFor="let row of rows">
        <input
          *ngFor="let col of cols"
          [value]="getCellValue(activeSheetId(), col + row)"
          (input)="updateCell(activeSheetId(), col + row, $event)"
        />
      </div>
    `,
  styleUrl: './editor.component.scss',
  standalone: false,
})
export class EditorComponent {
  store = inject(SpreadsheetStore);
  workbook = this.store.workbook;
  activeSheetId = computed(() => this.workbook().activeSheetId);

  rows = ['1', '2', '3', '4', '5'];
  cols = ['A', 'B', 'C', 'D', 'E'];

  getCellValue(sheetId: string, cellId: string) {
    return this.workbook().sheets[sheetId]?.cells[cellId]?.value || '';
  }

  updateCell(sheetId: string, cellId: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.store.updateCell(sheetId, cellId, inputElement.value);
  }
}
