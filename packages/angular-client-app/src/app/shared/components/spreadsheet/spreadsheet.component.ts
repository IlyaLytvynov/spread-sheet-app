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
import { IUICell, SpreadSheetData } from './types';

@Component({
  selector: 'app-spreadsheet',
  standalone: true,
  imports: [CommonModule, RootComponent, RowComponent, CellComponent],
  template: `
    <div class="topbar" [style.min-height.px]="columnTitleHeight">
      <div
        class="column"
        *ngFor="let column of columns; let i = index"
        [style.min-width.px]="columnDefaultWidth"
        (click)="selectColumn(i)"
      >
        {{ column }}
      </div>
    </div>
    <div class="leftbar">
      <div
        class="row"
        *ngFor="let row of table?.layout; let i = index"
        (click)="selectRow(i)"
        [style.height.px]="rowDefaultHeight"
      >
        {{ i }}
      </div>
    </div>
    <div class="content">
      <app-table-row *ngFor="let row of table?.layout; let rowIndex = index">
        <app-table-cell
          *ngFor="let cell of row; let cellIndex = index"
          [cell]="cell"
          (click)="selectCell(cell)"
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

  table = Table.initializeTableLayout({
    rowsCount: 10,
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
    return this.table.columns;
  }

  ngOnInit() {}

  selectColumn(index: number) {
    this.table = this.table.selectColumn([index]);
  }

  selectCell(cell: IUICell) {
    this.table = this.table.selectCell(cell);
  }

  selectRow(index: number) {
    this.table = this.table.selectRow([index]);
  }
}
