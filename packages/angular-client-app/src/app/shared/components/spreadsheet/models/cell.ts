import { IUICell } from '../types';

export class Cell implements IUICell {
  static fromExisting(exisiting: IUICell) {
    return new Cell(exisiting.value, exisiting.isActive, exisiting.isFocus);
  }
  constructor(
    public value: string = '',
    public isActive: boolean,
    public isFocus: boolean
  ) {}

  focus() {
    this.isFocus = true;
    return this;
  }
}
