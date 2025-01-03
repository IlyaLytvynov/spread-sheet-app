import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-spreadsheet-left-bar',
    imports: [CommonModule, DragDropModule],
    encapsulation: ViewEncapsulation.Emulated,
    template: `
    <div
      class="row"
      *ngFor="let row of rows; let i = index"
      (click)="onSelect(i)"
      [style.height.px]="height"
    >
      <span>{{ i }}</span>
      <span
        cdkDrag
        cdkDragLockAxis="y"
        class="line"
        (cdkDragStarted)="onDragStart($event, i)"
        (cdkDragDropped)="onDragDropped($event)"
        (cdkDragEnded)="onDragEnded($event)"
      ></span>
    </div>
  `,
    styleUrl: './left-bar.component.scss'
})
export class LeftBarComponent {
  @Input() height: number | undefined;
  @Input() rowsCount: number | undefined;

  @Output() select: EventEmitter<number> = new EventEmitter();
  @Output() resize: EventEmitter<number> = new EventEmitter();

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

  onDragStart(event: any, i: any) {
    console.log(event, i);
  }

  onDragMove(event: any, i: any) {
    console.log(event, i);
  }

  onDragDropped(event: any) {
    console.log(event);
  }

  onDragEnded(event: any) {
    console.log(event);
  }
}
