import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-spreadsheet-top-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="column"
      *ngFor="let column of columns; let i = index"
      [style.min-width.px]="columnWidth"
      (click)="onSelect(i)"
    >
      {{ column }}
    </div>
  `,
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  @Input() columns: string[] | undefined;
  @Input() columnWidth: number | undefined;
  @Input() height: number | undefined;

  @Output() select: EventEmitter<number> = new EventEmitter();

  @HostBinding('style.height') get hostHeight() {
    return `${this.height}px`;
  }

  onSelect(i: number) {
    this.select.emit(i);
  }
}
