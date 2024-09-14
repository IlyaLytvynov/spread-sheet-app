import { TableLayout } from "../types";
import { Cell } from "./cell";

const cells = 'ABCDEFJKLMNOPQRSTUVWXYZ';

export class Table {
  layout: TableLayout;

  constructor(layout: TableLayout = []) {
    this.layout = layout;
  }

  static generateLayout({
    r,
    c = cells.length,
    data = {},
  }: {
    r: number;
    c?: number;
    data?: Record<string, string>;
  }): Table {
    const layout: TableLayout = [];
    for (let i = 1; i < r; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < c; j++) {
        const key = cells[j] + i;
        // This prevent from redundant re renders of cells
        const cell = new Cell(data[key], false, false);
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
}
