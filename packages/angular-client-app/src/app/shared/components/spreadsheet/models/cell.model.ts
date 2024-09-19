import { IUICell } from '../types';

export class Cell implements IUICell {
  static cloneCell({
    value,
    columnIndex,
    rowIndex,
    hasFocus,
  }: IUICell) {
    return new Cell(value, columnIndex, rowIndex, hasFocus);
  }
  constructor(
    public value: string = '',
    public columnIndex: string, //'ABC'
    public rowIndex: number, // 0-999
    public hasFocus: boolean
  ) {}


  focus() {
    this.hasFocus = true;
    return Cell.cloneCell(this);
  }

  blur() {
    this.hasFocus = false;
    return Cell.cloneCell(this);
  }
}
