import { Injectable, signal } from '@angular/core';
import { ICell, IWorkbook } from '../types';

const mockWorkBook: IWorkbook = {
  id: '1',
  name: 'My Spreadsheet 111',
  sheets: {
    sheet1: {
      id: 'sheet1',
      name: 'Sheet 1',
      cells: {
        "A1": {
          value: 10
        },
        "B1": {
          value: 5,
        },
        "A2": {
          value: 15,
          styles: {
            alignment: 'right',
            backgroundColor: '#00ff00',
            fontSize: 16,
            italic: true,
            underline: true,
            textColor: '#000000',
            bold: true,
          }
        },
        "C1": {
          value: null,
          formula: '=SUM(A1:B1)',

        }
      },
    },
  },
  activeSheetId: 'sheet1',
}

@Injectable({ providedIn: 'root' })
export class SpreadsheetStore {
  workbook = signal<IWorkbook>(mockWorkBook);
  activeCells = signal<string[]>([]);

  /**
   *
   * @param sheetId id of sheet to update
   * @param cellId col + row for example A1, Y300
   * @param newValue ICell
   */
  updateCell(sheetId: string, cellId: string, cell: ICell) {
    this.workbook.update((workbook) => {
      const sheet = workbook.sheets[sheetId];
      if (sheet) {
        sheet.cells[cellId] = cell;
      }
      return { ...workbook };
    });
  }

  /**
   * Set the active (selected) cells, replacing current selection
   * @param cellIds array of cell IDs (col + row, e.g., A1, Y300)
   */
  setActiveCells(cellIds: string[]) {
    this.activeCells.set([...cellIds]);
  }

  /**
   * Add a cell to the active selection
   * @param cellId col + row for example A1, Y300
   * @param clearPrevious if true, clears existing selection before adding
   */
  addActiveCell(cellId: string, clearPrevious: boolean = true) {
    this.activeCells.update(current => {
      if (clearPrevious) {
        return [cellId];
      }
      // Add only if not already in selection
      if (!current.includes(cellId)) {
        return [...current, cellId];
      }
      return current;
    });
  }

  /**
   * Remove a cell from the active selection
   * @param cellId col + row for example A1, Y300
   */
  removeActiveCell(cellId: string) {
    this.activeCells.update(current =>
      current.filter(id => id !== cellId)
    );
  }

  /**
   * Toggle a cell in the active selection
   * @param cellId col + row for example A1, Y300
   * @param multiSelect if true, allows multiple selection, if false replaces selection
   */
  toggleActiveCell(cellId: string, multiSelect: boolean = false) {
    this.activeCells.update(current => {
      const isSelected = current.includes(cellId);

      if (!multiSelect) {
        // Single selection mode
        return isSelected ? [] : [cellId];
      }

      // Multi-selection mode
      if (isSelected) {
        return current.filter(id => id !== cellId);
      } else {
        return [...current, cellId];
      }
    });
  }

  /**
   * Clear all active cell selections
   */
  clearActiveCells() {
    this.activeCells.set([]);
  }

  /**
   * Check if a cell is currently selected
   * @param cellId col + row for example A1, Y300
   */
  isCellActive(cellId: string): boolean {
    return this.activeCells().includes(cellId);
  }
}
