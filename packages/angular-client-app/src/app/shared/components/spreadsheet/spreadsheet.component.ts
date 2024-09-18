import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { RootComponent } from './components/root/root.component';
import { RowComponent } from './components/row/row.component';
import { CellComponent } from './components/cell/cell.component';
import { CommonModule } from '@angular/common';
import { Table } from './models/table.model';
import { SpreadSheetData } from './types';

@Component({
  selector: 'app-spreadsheet',
  standalone: true,
  imports: [CommonModule, RootComponent, RowComponent, CellComponent],
  template: `
    <div class="topbar" [style.min-height.px]="columnTitleHeight">
      <div
        class="column"
        [style.min-width.px]="columnDefaultWidth"
        *ngFor="let column of columns"
      >
        {{ column }}
      </div>
    </div>
    <div class="leftbar">
      <div
        class="row"
        *ngFor="let row of table?.layout; let i = index"
        [style.height.px]="i !== 0 ? rowDefaultHeight : columnTitleHeight"
      >
        {{ i }}
      </div>
    </div>
    <div class="content">
      <app-table-row *ngFor="let row of table?.layout; let rowIndex = index">
        <app-table-cell
          *ngFor="let cell of row; let cellIndex = index"
          [cell]="cell"
          (click)="selectCell(cellIndex)"
          [width]="columnDefaultWidth"
          [height]="rowDefaultHeight"
        >
        </app-table-cell>
      </app-table-row>
    </div>
  `,
  styleUrl: './spreadsheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpreadsheetComponent {
  @Input() spreadSheet: SpreadSheetData = {};

  table = Table.generateLayout({
    rows: 50,
    data: {
      A1: '1',
      B1: '3',
    },
  });

  columnDefaultWidth = 100;
  rowDefaultHeight = 40;
  columnTitleHeight = 30;
  constructor(private cDRef: ChangeDetectorRef) {}

  get columns() {
    console.log(Table.columns);
    return Table.columns;
  }

  ngOnInit() {}

  selectCell(index: number) {
    this.table = this.table.toggleFocusColumn([index]);
  }
}
