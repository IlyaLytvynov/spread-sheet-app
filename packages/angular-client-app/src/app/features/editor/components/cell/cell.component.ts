import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  signal,
  ViewChild,
  ViewEncapsulation,
  computed,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ICell } from '../../types';
import { CommonModule } from '@angular/common';
import { processStyles } from '../../utils/style-processor';

@Component({
  selector: 'editor-cell',
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellComponent implements OnDestroy {
  @Input() cell: ICell | null = null;
  @Input() cellId: string = '';
  @Input() isActive: boolean = false;
  @Output() update: EventEmitter<ICell> = new EventEmitter();
  @Output() select: EventEmitter<{ cellId: string, event?: MouseEvent }> = new EventEmitter();

  @ViewChild('editInput') editInput?: ElementRef<HTMLInputElement>;

  private elementRef = inject(ElementRef);
  private document = inject(DOCUMENT);
  private documentClickListener?: (event: MouseEvent) => void;
  private keydownListener?: (event: KeyboardEvent) => void;

  editValue = signal<ICell['value']>(this.cell?.value || '');
  edit = signal<boolean>(false);

  // Computed signal using styleProcessor utility
  cellStyles = computed(() => processStyles(this.cell?.styles));

  get random() {
    return Math.ceil(Math.random() * 200);
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    // Add document click listener
    this.documentClickListener = (event: MouseEvent) => {
      const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);
      if (!clickedInside) {
        this.saveAndDisableEdit();
      }
    };
    this.document.addEventListener('click', this.documentClickListener);

    // Add keydown listener
    this.keydownListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.cancelEdit();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        this.saveAndDisableEdit();
      }
    };
    this.document.addEventListener('keydown', this.keydownListener);
  }

  private removeEventListeners() {
    if (this.documentClickListener) {
      this.document.removeEventListener('click', this.documentClickListener);
      this.documentClickListener = undefined;
    }
    if (this.keydownListener) {
      this.document.removeEventListener('keydown', this.keydownListener);
      this.keydownListener = undefined;
    }
  }

  onCellClick(event: MouseEvent) {
    this.select.emit({ cellId: this.cellId, event });
  }

  toggleEdit() {
    if (this.edit()) {
      this.saveAndDisableEdit();
    } else {
      this.enableEdit();
    }
  }

  enableEdit() {
    const editValue = this.cell?.value || '';
    this.editValue.set(editValue);
    this.edit.set(true);

    // Add event listeners only when entering edit mode
    this.addEventListeners();

    // Focus the input after the view updates
    setTimeout(() => {
      this.editInput?.nativeElement.focus();
      this.editInput?.nativeElement.select();
    });
  }

  disableEdit() {
    this.edit.set(false);
    // Remove event listeners when exiting edit mode
    this.removeEventListeners();
  }

  saveAndDisableEdit() {
    // Create updated cell with new value
    const updatedCell: ICell = {
      ...this.cell,
      value: this.editValue() || null,
    };

    this.update.emit(updatedCell);
    this.disableEdit();
  }

  cancelEdit() {
    // Reset to original value without saving
    this.editValue.set(this.cell?.value || null);
    this.disableEdit();
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.editValue.set(target.value);
  }
}
