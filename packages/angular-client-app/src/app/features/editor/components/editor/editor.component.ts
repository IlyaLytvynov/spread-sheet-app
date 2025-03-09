import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { SpreadsheetStore } from '../../store/editor.store';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  standalone: false,
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit {
  store = inject(SpreadsheetStore);
  workbook = this.store.workbook;
  activeSheetId = computed(() => this.workbook().activeSheetId);
  activeSheet = computed(() => this.workbook().sheets[this.activeSheetId()]);
  private platformId = inject(PLATFORM_ID);

  rows = ['1', '2', '3', '4', '5'];
  cols = ['A', 'B', 'C', 'D', 'E'];

  getCellValue(cellId: string) {
    return this.activeSheet()?.cells[cellId]?.value || '';
  }

  getCell(cellId: string) {
    return this.activeSheet()?.cells[cellId];
  }

  updateCell(cellId: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.store.updateCell(this.activeSheetId(), cellId, inputElement.value);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        this.store.updateCell(
          this.activeSheetId(),
          'A1',
          Math.ceil(Math.random() * 99)
        );
      }, 4000);
    }
  }
}
