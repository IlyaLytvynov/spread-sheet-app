export type TableLayout = IUICell[][];

export interface IUICell {
  value: string;
  isActive: boolean;
  isFocus: boolean;
}
