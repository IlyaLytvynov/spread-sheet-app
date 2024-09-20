import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spreadsheet-left-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="row"
      *ngFor="let row of rows; let i = index"
      (click)="onSelect(i)"
      [style.height.px]="height"
    >
      {{ i }}
    </div>
  `,
  styleUrl: './left-bar.component.scss',
})
export class LeftBarComponent {
  @Input() height: number | undefined;
  @Input() rowsCount: number | undefined;

  @Output() select: EventEmitter<number> = new EventEmitter();

  @HostBinding('style.height') get rowHeight() {
    return `${this.height}px`;
  }

  get rows() {
    if (this.rowsCount === undefined) {
      return [];
    }

    const rows = [];

    for (let i = 0; i < this.rowsCount; i++) {
      rows.push(i);
    }
    return rows;
  }

  onSelect(i: number) {
    this.select.emit(i);
  }
}
