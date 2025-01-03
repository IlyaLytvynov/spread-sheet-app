import { IUICell } from '../types';

export class Cell implements IUICell {
  static cloneCell({
    value,
    columnIndex,
    rowIndex,
    hasFocus,
    height,
    width,
  }: IUICell) {
    return new Cell(value, columnIndex, rowIndex, hasFocus, height, width);
  }
  constructor(
    public value: string = '',
    public columnIndex: string, //'ABC'
    public rowIndex: number, // 0-999
    public hasFocus: boolean,
    public height: number = 50,
    public width: number = 120
  ) // TODO add layout to keep width/height and add update layout in tabel
  {}

  focus() {
    this.hasFocus = true;
    return Cell.cloneCell(this);
  }

  blur() {
    this.hasFocus = false;
    return Cell.cloneCell(this);
  }
}
