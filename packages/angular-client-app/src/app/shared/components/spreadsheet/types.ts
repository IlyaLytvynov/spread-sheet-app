export type TableLayout = IUICell[][];


export interface ICell {
  value: string;
  columnIndex: string;
  rowIndex: number;
}


export interface IUICell extends ICell {
  hasFocus: boolean;
  height: number;
  width: number;
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
