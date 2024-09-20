export type TableLayout = IUICell[][];

export interface IUICell {
  value: string;
  hasFocus: boolean;
  columnIndex: string;
  rowIndex: number;
  focus(): IUICell;
  blur(): IUICell;
}

export type SpreadSheetData = Record<string, string>;


// export interface IResizable {
//   columns: string[] | undefined;
//   columnWidth: number | undefined;
//   height: number | undefined;
//   selectColumn: EventEmitter<number>;
//   hostHeight: string;
//   onSelect(i: number): void;
// }
