import { Injectable, signal } from '@angular/core';
import { IWorkbook } from '../types';

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
            alignment: 'left',
            backgroundColor: '#00ff00'
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
  /**
   *
   * @param sheetId id of sheet to update
   * @param cellId col + row for example A1, Y300
   * @param newValue any of value type
   */
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
