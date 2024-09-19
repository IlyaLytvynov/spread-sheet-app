import { COLUMNS, DEFAULT_ROW_COUMTS, Table } from './table.model'; // Adjust the import path as necessary

describe('Table', () => {
  describe('generateLayout', () => {
    it('should generate layout with given rowsCount and columns', () => {
      const rowsCount = 3;
      const columns = 5;

      const data = { A1: 'data1', B1: 'data2', C1: 'data3' };
      const table = Table.initializeTableLayout({
        rowsCount,
        columnsCount: columns,
        data,
      });

      expect(table).toBeInstanceOf(Table);
      expect(table.layout.length).toBe(rowsCount);

      expect(table.layout[0].length).toBe(columns);
      expect(table.columns).toEqual(COLUMNS.slice(0, columns).split(''));
    });

    it('should generate layout with default rowsCount and columns', () => {
      const data = { A1: 'data1', B1: 'data2', C1: 'data3' };
      const table = Table.initializeTableLayout({
        data,
      });

      expect(table).toBeInstanceOf(Table);
      expect(table.layout.length).toBe(DEFAULT_ROW_COUMTS);

      expect(table.layout[0].length).toBe(COLUMNS.length);
      expect(table.columns).toEqual(COLUMNS.split(''));
    });

    it('should handle missing optional parameters', () => {
      const rowsCount = 2;
      const table = Table.initializeTableLayout({ rowsCount });

      expect(table).toBeInstanceOf(Table);
      expect(table.layout.length).toBe(rowsCount);
    });
  });

  describe('selectColumn', () => {
    it('should toggle focus on a single column', () => {
      const rowsCount = 3;
      const data = { A1: 'data1', B1: 'data2', C1: 'data3' };
      const table = Table.initializeTableLayout({ rowsCount, data });

      table.selectColumn(1);
      expect(table.layout[0][1].hasFocus).toBe(true);
    });

    it('should toggle focus on multiple columns', () => {
      const rowsCount = 3;
      const data = { A1: 'data1', B1: 'data2', C1: 'data3' };
      const table = Table.initializeTableLayout({ rowsCount, data });

      table.selectColumn([0, 2]);
      expect(table.layout[0][0].hasFocus).toBe(true);
      expect(table.layout[0][2].hasFocus).toBe(true);
    });
  });

});
