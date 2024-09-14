import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { RootComponent } from './components/root/root.component';
import { RowComponent } from './components/row/row.component';
import { CellComponent } from './components/cell/cell.component';
import { CommonModule } from '@angular/common';
import { Table } from './models/table';

@Component({
  selector: 'app-spreadsheet',
  standalone: true,
  imports: [CommonModule, RootComponent, RowComponent, CellComponent],
  template: `
    <app-table-row *ngFor="let row of table?.layout; let i = index">
      <app-table-cell
        *ngFor="let cell of row; let cellIndex = index"
        [cell]="cell"
        (click)="selectCell(cellIndex)"
      >
      </app-table-cell>
    </app-table-row>
  `,
  styleUrl: './spreadsheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpreadsheetComponent {
  table = Table.generateLayout({
    r: 50,
    data: {
      A1: '1',
      B1: '3',
    },
  });

  constructor(private cDRef: ChangeDetectorRef) {}

  ngOnInit() {}

  selectCell(index: number) {
    this.table = this.table.toggleFocusColumn([index]);
  }
}
