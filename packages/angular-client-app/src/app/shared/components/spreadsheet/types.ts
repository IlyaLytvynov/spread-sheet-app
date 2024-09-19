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
