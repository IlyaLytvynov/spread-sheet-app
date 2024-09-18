import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IUICell } from '../../types';

const checkUpdates = (currentValue: any, previous: any) => {
  if (!currentValue || !previous) {
    return true;
  }
  return Object.keys(currentValue).reduce((shouldUpdate, key) => {
    if (previous[key] !== currentValue[key]) {
      return true;
    }
    return shouldUpdate;
  }, false);
};

@Component({
  selector: 'app-table-cell',
  standalone: true,
  imports: [CommonModule],
  template: `{{ cell?.value }} {{ random }}`,
  styleUrl: './cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent implements OnChanges {
  @Input() cell: IUICell | undefined;
  @Input() width: number | undefined;
  @Input() height: number | undefined;

  @HostBinding('class.focus') get focus() {
    return this.cell?.isFocus;
  }

  @HostBinding('style.width') get hostWidth() {
    return `${this.width}px`
  }

  @HostBinding('style.height') get hostHeight() {
    return `${this.height}px`
  }

  constructor(private cdRef: ChangeDetectorRef) {}

  get random() {
    return Math.ceil(Math.random() * 999);
  }

  ngOnInit() {
    // this.cdRef.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {}
}
