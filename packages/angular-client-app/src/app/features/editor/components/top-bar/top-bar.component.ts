import { Component, ViewEncapsulation, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpreadsheetStore } from '../../store';
import { ICell } from '../../types';

@Component({
  selector: 'editor-top-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  private spreadsheetStore = inject(SpreadsheetStore);

  // Currently selected cell (placeholder for now)
  selectedCellId = signal<string>('A1');

  // Formula bar value
  formulaValue = signal<string>('');

  // Get current cell data
  currentCell = computed(() => {
    const workbook = this.spreadsheetStore.workbook();
    const activeSheet = workbook.sheets[workbook.activeSheetId];
    const cellId = this.selectedCellId();
    return activeSheet?.cells[cellId] || { value: null };
  });

  // Font size options
  fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  // Alignment options
  alignmentOptions = [
    { value: 'left', icon: '⬅️', label: 'Left' },
    { value: 'center', icon: '↔️', label: 'Center' },
    { value: 'right', icon: '➡️', label: 'Right' }
  ];

  // Text formatting methods
  toggleBold() {
    this.updateCellStyle('bold', !this.currentCell().styles?.bold);
  }

  toggleItalic() {
    this.updateCellStyle('italic', !this.currentCell().styles?.italic);
  }

  toggleUnderline() {
    this.updateCellStyle('underline', !this.currentCell().styles?.underline);
  }

  updateFontSize(size: number) {
    this.updateCellStyle('fontSize', size);
  }

  updateAlignment(alignment: string) {
    this.updateCellStyle('alignment', alignment);
  }

  updateTextColor(color: string) {
    this.updateCellStyle('textColor', color);
  }

  updateBackgroundColor(color: string) {
    this.updateCellStyle('backgroundColor', color);
  }

  // Apply formula
  applyFormula() {
    const formula = this.formulaValue();
    if (formula.trim()) {
      const currentCellData = this.currentCell();
      const updatedCell: ICell = {
        ...currentCellData,
        formula: formula.startsWith('=') ? formula : `=${formula}`,
        value: null // Clear value when formula is set
      };

      this.spreadsheetStore.updateCell(
        this.spreadsheetStore.workbook().activeSheetId,
        this.selectedCellId(),
        updatedCell
      );
    }
  }

  // Clear formula
  clearFormula() {
    this.formulaValue.set('');
    const currentCellData = this.currentCell();
    const updatedCell: ICell = {
      ...currentCellData,
      formula: undefined
    };

    this.spreadsheetStore.updateCell(
      this.spreadsheetStore.workbook().activeSheetId,
      this.selectedCellId(),
      updatedCell
    );
  }

  private updateCellStyle(property: string, value: any) {
    const currentCellData = this.currentCell();
    const updatedCell: ICell = {
      ...currentCellData,
      styles: {
        ...currentCellData.styles,
        [property]: value
      }
    };

    this.spreadsheetStore.updateCell(
      this.spreadsheetStore.workbook().activeSheetId,
      this.selectedCellId(),
      updatedCell
    );
  }

  // Helper methods for template
  isBold(): boolean {
    return this.currentCell().styles?.bold || false;
  }

  isItalic(): boolean {
    return this.currentCell().styles?.italic || false;
  }

  isUnderline(): boolean {
    return this.currentCell().styles?.underline || false;
  }

  getCurrentFontSize(): number {
    return this.currentCell().styles?.fontSize || 12;
  }

  getCurrentAlignment(): string {
    return this.currentCell().styles?.alignment || 'left';
  }

  getCurrentTextColor(): string {
    return this.currentCell().styles?.textColor || '#000000';
  }

  getCurrentBackgroundColor(): string {
    return this.currentCell().styles?.backgroundColor || '#ffffff';
  }

  getCurrentFormula(): string {
    return this.currentCell().formula || '';
  }
}
