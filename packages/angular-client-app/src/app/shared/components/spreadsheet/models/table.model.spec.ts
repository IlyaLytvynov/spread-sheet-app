import { Table } from './table.model'; // Adjust the import path as necessary

describe('Table', () => {
  describe('generateLayout', () => {
    it('should generate layout with given rows and columns', () => {
      const rows = 3;
      const columns = ['A', 'B', 'C'];
      const data = { A1: 'data1', B1: 'data2', C1: 'data3' };
      const table = Table.generateLayout({ rows, columns: columns.length, data });

      expect(table).toBeInstanceOf(Table);
      expect(table.layout).toHaveLength(rows - 1);
      expect(table.layout[0]).toHaveLength(columns.length);
    });

    it('should handle missing optional parameters', () => {
      const rows = 2;
      const table = Table.generateLayout({ rows });

      expect(table).toBeInstanceOf(Table);
      expect(table.layout).toHaveLength(rows - 1);
    });
  });

  describe('toggleFocusColumn', () => {
    it('should toggle focus on a single column', () => {
      const rows = 3;
      const columns = ['A', 'B', 'C'];
      const data = { A1: 'data1', B1: 'data2', C1: 'data3' };
      const table = Table.generateLayout({ rows, columns, data });

      table.toggleFocusColumn(1);
      expect(table.layout[0][1].isFocused).toBe(true);
    });

    it('should toggle focus on multiple columns', () => {
      const rows = 3;
      const columns = ['A', 'B', 'C'];
      const data = { A1: 'data1', B1: 'data2', C1: 'data3' };
      const table = Table.generateLayout({ rows, columns, data });

      table.toggleFocusColumn([0, 2]);
      expect(table.layout[0][0].isFocused).toBe(true);
      expect(table.layout[0][2].isFocused).toBe(true);
    });
  });
});
