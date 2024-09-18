export type TableLayout = IUICell[][];

export interface IUICell {
  value: string;
  isActive: boolean;
  isFocus: boolean;
  columnIndex: string;
  rowIndex: string;
}

export type SpreadSheetData = Record<string, string>;
