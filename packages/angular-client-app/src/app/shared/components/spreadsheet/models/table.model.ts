import { IUICell, TableLayout } from '../types';
import { Cell } from './cell.model';

export const COLUMNS = 'ABCDEFJKLMNOPQRSTUVWXYZ';
export const DEFAULT_ROW_COUMTS = 100;

export class Table {
  static initializeTableLayout({
    rowsCount = DEFAULT_ROW_COUMTS,
    columnsCount = COLUMNS.length,
    data = {},
  }: {
    rowsCount?: number;
    columnsCount?: number;
    data?: Record<string, string>;
  }): Table {
    const layout: TableLayout = [];
    let columns = COLUMNS.slice(0, columnsCount).split(''); // need to set columns for ui, for example A-D, by default A-Z

    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
      const row: Cell[] = [];
      for (let j = 0; j < columnsCount; j++) {
        const key = COLUMNS[j] + rowIndex;
        // This prevent from redundant re renders of cells
        const cell = new Cell(data[key], COLUMNS[j], rowIndex, false);
        row.push(cell);
      }
      layout.push(row);
    }
    return new Table(layout, columns, rowsCount);
  }

  state = {
    activeColumnsIndexes: [],
    activeRowIndexes: [],
    selectedColumnIndecies: [],
    selectedRowsIndecies: []
  };

  constructor(
    public layout: TableLayout = [],
    public readonly columns: string[],
    public readonly rowsCount: number
  ) {}

  selectColumn(columnIndices: number[] | number): Table {
    const indices = Array.isArray(columnIndices)
      ? columnIndices
      : [columnIndices];
    const cellsToPerfomAction = this.layout.reduce(
      (arr, row) => [...arr, ...indices.map((index) => row[index])],
      []
    );

    cellsToPerfomAction.forEach((cell) => {
      this.selectCell(cell);
    });
    return this;
  }

  selectRow(rowIndecies: number[] | number) {
    const indices = Array.isArray(rowIndecies) ? rowIndecies : [rowIndecies];

    const cellsToPerfomAction = indices.reduce(
      (arr, index) => [...arr, ...this.layout[index]],
      [] as IUICell[]
    );

    cellsToPerfomAction.forEach((cell) => {
      this.selectCell(cell);
    });
    return this;
  }

  selectCell(cell: IUICell): Table {
    this.layout = this.performeAction(this.layout, cell, (cell: IUICell) =>
      cell.focus()
    );
    return this;
  }

  blurCell(cell: IUICell): Table {
    this.layout = this.performeAction(this.layout, cell, (cell: IUICell) =>
      cell.blur()
    );
    return this;
  }

  private performeAction(
    layout: TableLayout,
    cell: IUICell,
    action: (cell: IUICell) => IUICell
  ) {
    const newLayout = [...layout];
    const { columnIndex, rowIndex } = cell;
    const newCell = action(cell);

    const row = Number(rowIndex);
    const column = this.columns.indexOf(columnIndex); // ColumnIndex is an letter A...XY we need to convert it to index in a row
    if (
      column === undefined ||
      column === -1 ||
      row === undefined ||
      isNaN(row)
    ) {
      throw new Error(`Column or row is undefined for ${cell}`);
    }
    newLayout[row][column] = newCell;
    return newLayout;
  }
}
