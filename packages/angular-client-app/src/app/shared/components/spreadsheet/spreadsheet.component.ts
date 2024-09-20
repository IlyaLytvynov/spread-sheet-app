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
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { LeftBarComponent } from './components/left-bar/left-bar.component';

@Component({
  selector: 'app-spreadsheet',
  standalone: true,
  imports: [
    CommonModule,
    RootComponent,
    RowComponent,
    CellComponent,
    TopBarComponent,
    LeftBarComponent,
  ],
  template: `
    <app-spreadsheet-top-bar
      [columns]="columns"
      [height]="columnTitleHeight"
      [columnWidth]="columnDefaultWidth"
      (select)="selectColumn($event)"
    ></app-spreadsheet-top-bar>
    <app-spreadsheet-left-bar
      [rowsCount]="table.rowsCount"
      [height]="rowDefaultHeight"
      (select)="selectRow($event)"
    ></app-spreadsheet-left-bar>
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
    columnsCount: 10,
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
