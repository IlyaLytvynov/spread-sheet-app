export interface ICellStyles {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  textColor?: string;
  backgroundColor?: string;
  alignment?: "left" | "center" | "right";
}


export interface ICell {
  value: string | number | null;
  formula?: string;
  computedValue?: string | number | null;
  styles?: ICellStyles
}

export type CellValue = ICell['value']

export interface ISheet {
  id: string;
  name: string;
  cells: Record<string, ICell>;
}

export interface IWorkbook {
  id: string;
  name: string;
  sheets: Record<string, ISheet>;
  activeSheetId: string;
}
