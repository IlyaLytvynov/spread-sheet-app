import { Injectable, signal } from '@angular/core';

interface Cell {
  value: string | number | null;
  formula?: string;
  computedValue?: string | number | null;
}

interface Sheet {
  id: string;
  name: string;
  cells: Record<string, Cell>;
}

interface Workbook {
  id: string;
  name: string;
  sheets: Record<string, Sheet>;
  activeSheetId: string;
}

const mockWorkBook = {
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
          value: 15
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
  workbook = signal<Workbook>(mockWorkBook);

  updateCell(sheetId: string, cellId: string, newValue: string | number) {
    this.workbook.update((workbook) => {
      const sheet = workbook.sheets[sheetId];
      if (sheet) {
        sheet.cells[cellId] = { value: newValue };
      }
      return { ...workbook };
    });
  }
}
