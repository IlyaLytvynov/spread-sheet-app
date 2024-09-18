import { TableLayout } from '../types';
import { Cell } from './cell.model';

const columns = 'ABCDEFJKLMNOPQRSTUVWXYZ';
const columnsIterableb = columns.split('');
export class Table {
  state = {
    activeColumnsIndexes: [],
    activeRowIndexes: [],
  }

  layout: TableLayout;

  static get columns() {
    return columnsIterableb;
  }

  constructor(layout: TableLayout = []) {
    this.layout = layout;
  }

  static generateLayout({
    rows,
    // columns = cells.length,
    data = {},
  }: {
    rows: number;
    columns?: number;
    data?: Record<string, string>;
  }): Table {
    const layout: TableLayout = [];
    for (let rowIndex = 1; rowIndex < rows; rowIndex++) {
      const row: Cell[] = [];
      for (let j = 0; j < columns.length; j++) {
        const key = columns[j] + rowIndex;
        // This prevent from redundant re renders of cells
        const cell = new Cell(data[key], columns[j], rowIndex.toString(), false, false);
        row.push(cell);
      }
      layout.push(row);
    }
    return new Table(layout);
  }

  toggleFocusColumn(cellIndices: number[] | number): Table {
    const indices = Array.isArray(cellIndices) ? cellIndices : [cellIndices];
    this.layout = this.layout.map((row) => {
      indices.forEach((cellIndex) => {
        const newInstance = Cell.fromExisting(row[cellIndex]);
        row[cellIndex] = newInstance.focus();
      });
      return row;
    });
    return this;
  }

  enableFocus() {

  }
}
