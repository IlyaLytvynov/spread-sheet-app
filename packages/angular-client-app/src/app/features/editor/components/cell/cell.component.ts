import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ICell } from '../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'editor-cell',
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent {
  @Input() cell: ICell | null = null;
  @Output() update: EventEmitter<ICell> = new EventEmitter();

  editValue = signal<string>('');
  edit = signal<boolean>(false);

  get random() {
    return Math.ceil(Math.random() * 200);
  }

  toggleEdit() {}

  enableEdit() {
    this.editValue.set(this.cell?.value);
    this.edit.set(true);
  }

  disbaleEdit() {
    this.edit.set(false);
  }
}
