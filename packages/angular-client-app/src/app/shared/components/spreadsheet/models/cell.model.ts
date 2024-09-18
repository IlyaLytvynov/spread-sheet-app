import { IUICell } from '../types';

export class Cell implements IUICell {
  static fromExisting({
    value,
    columnIndex,
    rowIndex,
    isActive,
    isFocus,
  }: IUICell) {
    return new Cell(value, columnIndex, rowIndex, isActive, isFocus);
  }
  constructor(
    public value: string = '',
    public columnIndex: string, //'ABC'
    public rowIndex: string, // 1-999
    public isActive: boolean,
    public isFocus: boolean
  ) {}

  focus() {
    this.isFocus = true;
    return this;
  }
}
