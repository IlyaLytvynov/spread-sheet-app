# Spreadsheet Editor App - Requirements & Instructions

## Project Overview
A web-based spreadsheet editor built with Angular that provides essential spreadsheet functionality including data entry, styling, formulas, and dynamic grid manipulation.

## Current Implementation Status
✅ **Already Implemented:**
- Basic grid structure (5x5 cells: A-E, 1-5)
- Cell component with value storage (text/numbers)
- Basic cell editing (double-click to edit)
- Angular signals-based state management
- Cell styling support (bold, italic, underline, fontSize, textColor, backgroundColor, alignment)
- Basic formula structure (e.g., =SUM(A1:B1))
- Workbook/Sheet architecture

## Core Requirements

### 1. Cell Data Management
- **Data Types Supported:** 
  - Text (strings)
  - Numbers (integers, decimals)
  - Formulas (starting with '=')
  - Boolean values
  - Dates
- **Cell Properties:**
  - Value (actual content)
  - Display value (computed result for formulas)
  - Formatting/styling
  - Data validation rules

### 2. Grid Structure & Navigation
- **Dynamic Grid Size:**
  - Minimum: 26 columns (A-Z), 100 rows
  - Expandable: Support up to 702 columns (A-ZZ), 10,000 rows
  - Virtual scrolling for performance
- **Navigation:**
  - Arrow key navigation between cells
  - Tab/Shift+Tab for horizontal navigation
  - Enter/Shift+Enter for vertical navigation
  - Click to select cells
  - Drag to select ranges

### 3. Column & Row Resizing ⭐
**Priority Feature - Not Yet Implemented**
- **Column Resizing:**
  - Draggable column borders
  - Double-click to auto-fit content
  - Minimum width: 50px
  - Maximum width: 500px
  - Persist column widths in workbook state
- **Row Resizing:**
  - Draggable row borders
  - Double-click to auto-fit content
  - Minimum height: 20px
  - Maximum height: 200px
  - Persist row heights in workbook state

### 4. Cell Editing & Input
- **Edit Modes:**
  - Double-click to enter edit mode
  - F2 key to edit selected cell
  - Direct typing to replace content
  - Escape to cancel editing
- **Input Validation:**
  - Real-time validation during typing
  - Error indicators for invalid formulas
  - Data type enforcement
- **Auto-complete:**
  - Function name suggestions
  - Cell reference suggestions

### 5. Styling & Formatting ⭐
**Expand Current Implementation**
- **Text Formatting:**
  - Font family, size, color
  - Bold, italic, underline
  - Text alignment (left, center, right)
- **Cell Formatting:**
  - Background color
  - Border styles (thin, thick, dashed)
  - Cell padding
- **Number Formatting:**
  - Currency ($1,234.56)
  - Percentage (12.34%)
  - Date formats (MM/DD/YYYY)
  - Decimal places control
- **Conditional Formatting:**
  - Color scales
  - Data bars
  - Icon sets

### 6. Formula System ⭐
**Enhance Current Basic Implementation**
- **Basic Functions:**
  - Mathematical: SUM, AVERAGE, MIN, MAX, COUNT
  - Logical: IF, AND, OR, NOT
  - Text: CONCATENATE, LEFT, RIGHT, MID, LEN
  - Date: TODAY, NOW, DATE, YEAR, MONTH, DAY
- **Formula Features:**
  - Cell references (A1, B2:D4)
  - Absolute references ($A$1)
  - Cross-sheet references (Sheet2!A1)
  - Error handling (#DIV/0!, #REF!, #VALUE!)
- **Formula Bar:**
  - Display current cell formula
  - Edit formulas directly
  - Formula syntax highlighting

### 7. Data Operations
- **Copy & Paste:**
  - Single cells and ranges
  - Preserve formatting
  - Paste special (values only, formatting only)
- **Cut & Fill:**
  - Cut cells with content removal
  - Auto-fill series (1,2,3... or Mon,Tue,Wed...)
  - Fill down/right operations
- **Undo & Redo:**
  - Action history stack
  - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)

## Technical Implementation Guidelines

### Data Structure Enhancements
```typescript
// Extend existing types.ts
export interface IColumnSettings {
  width: number;
  hidden: boolean;
  autoFit: boolean;
}

export interface IRowSettings {
  height: number;
  hidden: boolean;
  autoFit: boolean;
}

export interface ISheet {
  id: string;
  name: string;
  cells: Record<string, ICell>;
  columnSettings: Record<string, IColumnSettings>; // A, B, C...
  rowSettings: Record<string, IRowSettings>; // 1, 2, 3...
  selectedRange?: ICellRange;
}

export interface ICellRange {
  startColumn: string;
  startRow: number;
  endColumn: string;
  endRow: number;
}
```

### Component Architecture
- **EditorComponent:** Main container, grid layout
- **CellComponent:** Individual cell with editing capability
- **ColumnHeaderComponent:** Column labels with resize handles
- **RowHeaderComponent:** Row numbers with resize handles
- **FormulaBarComponent:** Formula input and display
- **ToolbarComponent:** Formatting controls

### Performance Considerations
- **Virtual Scrolling:** Only render visible cells
- **Debounced Updates:** Batch state changes
- **Memoization:** Cache computed formula results
- **Lazy Loading:** Load sheets on demand

## User Interface Requirements

### Layout Structure
```
┌─────────────────────────────────────────┐
│ Toolbar (Format, Functions, etc.)      │
├─────────────────────────────────────────┤
│ Formula Bar                             │
├─────┬───────────────────────────────────┤
│     │ A    │ B    │ C    │ D    │ E    │
├─────┼──────┼──────┼──────┼──────┼──────┤
│  1  │  10  │  5   │  15  │      │      │
├─────┼──────┼──────┼──────┼──────┼──────┤
│  2  │  15  │      │      │      │      │
├─────┼──────┼──────┼──────┼──────┼──────┤
│  3  │      │      │      │      │      │
└─────┴──────┴──────┴──────┴──────┴──────┘
```

### Keyboard Shortcuts
- **Ctrl+C:** Copy
- **Ctrl+V:** Paste
- **Ctrl+X:** Cut
- **Ctrl+Z:** Undo
- **Ctrl+Y:** Redo
- **F2:** Edit cell
- **Delete:** Clear cell content
- **Ctrl+B:** Bold
- **Ctrl+I:** Italic
- **Ctrl+U:** Underline

## Development Phases

### Phase 1: Core Grid Enhancements
1. Implement column/row resizing functionality
2. Add column and row headers with resize handles
3. Expand grid to support A-Z columns, 100 rows
4. Implement cell selection and range selection

### Phase 2: Enhanced Editing
1. Improve cell editing experience
2. Add formula bar component
3. Implement keyboard navigation
4. Add input validation and error handling

### Phase 3: Styling & Formatting
1. Create formatting toolbar
2. Implement number formatting options
3. Add border and background styling
4. Create style picker components

### Phase 4: Formula Engine
1. Build formula parser and evaluator
2. Implement basic mathematical functions
3. Add cell reference resolution
4. Create function auto-complete

### Phase 5: Data Operations
1. Implement copy/paste functionality
2. Add undo/redo system
3. Create auto-fill capabilities
4. Add data import/export

## Testing Requirements
- **Unit Tests:** All components and services
- **Integration Tests:** Cell editing workflows
- **E2E Tests:** Complete user scenarios
- **Performance Tests:** Large grid rendering
- **Accessibility Tests:** Keyboard navigation, screen readers

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Success Criteria
1. ✅ Users can enter text and numbers in cells
2. ⏳ Users can resize columns and rows by dragging
3. ⏳ Users can apply basic formatting (bold, italic, colors)
4. ⏳ Users can create simple formulas (SUM, AVERAGE)
5. ⏳ Users can navigate using keyboard
6. ⏳ Users can copy and paste data
7. ⏳ Grid performs well with 1000+ cells
8. ⏳ Interface is intuitive and responsive

## Files to Modify/Create

### Immediate Priority (Phase 1):
1. `types.ts` - Add column/row settings interfaces
2. `editor.store.ts` - Add resize functionality
3. `editor.component.html` - Add column/row headers
4. `editor.component.scss` - Add resize handle styles
5. Create `column-header.component.ts`
6. Create `row-header.component.ts`

### Next Steps:
7. Create `formula-bar.component.ts`
8. Create `toolbar.component.ts`
9. Enhance `cell.component.ts` with better editing
10. Create `formula.service.ts` for calculations

This specification builds on your existing Angular implementation and provides a clear roadmap for developing a fully-featured spreadsheet editor with the simple functionality you requested.

