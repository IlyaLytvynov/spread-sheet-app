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
import { ICell } from '../../types';

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
  activeCells = this.store.activeCells;
  private platformId = inject(PLATFORM_ID);

  rows = ['1', '2', '3', '4', '5', ];
  cols = ['A', 'B', 'C', 'D', 'E'];

  getCellValue(cellId: string) {
    return this.activeSheet()?.cells[cellId]?.value || '';
  }

  getCell(cellId: string) {
    return this.activeSheet()?.cells[cellId];
  }

  updateCell(cellId: string, value: ICell) {
    this.store.updateCell(this.activeSheetId(), cellId, value);
  }

  selectCell(eventData: { cellId: string, event?: MouseEvent }) {
    const multiSelect = eventData.event?.ctrlKey || eventData.event?.metaKey; // Support Ctrl/Cmd for multi-select
    this.store.toggleActiveCell(eventData.cellId, multiSelect);
  }

  isCellActive(cellId: string): boolean {
    return this.store.isCellActive(cellId);
  }

  ngOnInit() {

  }
}
