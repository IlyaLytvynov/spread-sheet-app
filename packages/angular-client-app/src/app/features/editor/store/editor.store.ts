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
}
