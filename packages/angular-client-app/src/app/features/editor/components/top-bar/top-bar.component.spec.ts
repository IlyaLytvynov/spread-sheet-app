import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TopBarComponent } from './top-bar.component';
import { SpreadsheetStore } from '../../store';
import { signal } from '@angular/core';
import { IWorkbook } from '../../types';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;
  let mockSpreadsheetStore: jasmine.SpyObj<SpreadsheetStore>;

  const mockWorkbook: IWorkbook = {
    id: '1',
    name: 'Test Workbook',
    sheets: {
      sheet1: {
        id: 'sheet1',
        name: 'Sheet 1',
        cells: {
          'A1': {
            value: 10,
            styles: {
              bold: true,
              fontSize: 14,
              textColor: '#000000',
              backgroundColor: '#ffffff',
              alignment: 'left'
            }
          }
        }
      }
    },
    activeSheetId: 'sheet1'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SpreadsheetStore', ['updateCell'], {
      workbook: signal(mockWorkbook)
    });

    await TestBed.configureTestingModule({
      imports: [TopBarComponent, FormsModule],
      providers: [
        { provide: SpreadsheetStore, useValue: spy }
      ]
    }).compileComponents();

    mockSpreadsheetStore = TestBed.inject(SpreadsheetStore) as jasmine.SpyObj<SpreadsheetStore>;
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the selected cell ID', () => {
    component.selectedCellId.set('B2');
    fixture.detectChanges();

    const cellReference = fixture.nativeElement.querySelector('.cell-reference');
    expect(cellReference.textContent.trim()).toBe('B2');
  });

  it('should toggle bold formatting', () => {
    const initialBold = component.isBold();

    component.toggleBold();

    expect(mockSpreadsheetStore.updateCell).toHaveBeenCalledWith(
      'sheet1',
      'A1',
      jasmine.objectContaining({
        styles: jasmine.objectContaining({
          bold: !initialBold
        })
      })
    );
  });

  it('should toggle italic formatting', () => {
    const initialItalic = component.isItalic();

    component.toggleItalic();

    expect(mockSpreadsheetStore.updateCell).toHaveBeenCalledWith(
      'sheet1',
      'A1',
      jasmine.objectContaining({
        styles: jasmine.objectContaining({
          italic: !initialItalic
        })
      })
    );
  });

  it('should toggle underline formatting', () => {
    const initialUnderline = component.isUnderline();

    component.toggleUnderline();

    expect(mockSpreadsheetStore.updateCell).toHaveBeenCalledWith(
      'sheet1',
      'A1',
      jasmine.objectContaining({
        styles: jasmine.objectContaining({
          underline: !initialUnderline
        })
      })
    );
  });

  it('should update font size', () => {
    const newSize = 18;

    component.updateFontSize(newSize);

    expect(mockSpreadsheetStore.updateCell).toHaveBeenCalledWith(
      'sheet1',
      'A1',
      jasmine.objectContaining({
        styles: jasmine.objectContaining({
          fontSize: newSize
        })
      })
    );
  });

  it('should update text alignment', () => {
    const newAlignment = 'center';

    component.updateAlignment(newAlignment);

    expect(mockSpreadsheetStore.updateCell).toHaveBeenCalledWith(
      'sheet1',
      'A1',
      jasmine.objectContaining({
        styles: jasmine.objectContaining({
          alignment: newAlignment
        })
      })
    );
  });

  it('should update text color', () => {
    const newColor = '#ff0000';

    component.updateTextColor(newColor);

    expect(mockSpreadsheetStore.updateCell).toHaveBeenCalledWith(
      'sheet1',
      'A1',
      jasmine.objectContaining({
        styles: jasmine.objectContaining({
          textColor: newColor
        })
      })
    );
  });

  it('should update background color', () => {
    const newColor = '#00ff00';

    component.updateBackgroundColor(newColor);

    expect(mockSpreadsheetStore.updateCell).toHaveBeenCalledWith(
      'sheet1',
      'A1',
      jasmine.objectContaining({
        styles: jasmine.objectContaining({
          backgroundColor: newColor
        })
      })
    );
  });

  it('should apply formula', () => {
    const formula = 'SUM(A1:B1)';
    component.formulaValue.set(formula);

    component.applyFormula();

    expect(mockSpreadsheetStore.updateCell).toHaveBeenCalledWith(
      'sheet1',
      'A1',
      jasmine.objectContaining({
        formula: `=${formula}`,
        value: null
      })
    );
  });

  it('should apply formula with equals sign already present', () => {
    const formula = '=SUM(A1:B1)';
    component.formulaValue.set(formula);

    component.applyFormula();

    expect(mockSpreadsheetStore.updateCell).toHaveBeenCalledWith(
      'sheet1',
      'A1',
      jasmine.objectContaining({
        formula: formula,
        value: null
      })
    );
  });

  it('should clear formula', () => {
    component.formulaValue.set('=SUM(A1:B1)');

    component.clearFormula();

    expect(component.formulaValue()).toBe('');
    expect(mockSpreadsheetStore.updateCell).toHaveBeenCalledWith(
      'sheet1',
      'A1',
      jasmine.objectContaining({
        formula: undefined
      })
    );
  });

  it('should return current cell properties correctly', () => {
    expect(component.isBold()).toBe(true);
    expect(component.getCurrentFontSize()).toBe(14);
    expect(component.getCurrentTextColor()).toBe('#000000');
    expect(component.getCurrentBackgroundColor()).toBe('#ffffff');
    expect(component.getCurrentAlignment()).toBe('left');
  });

  it('should return default values for empty cell', () => {
    component.selectedCellId.set('B2'); // Cell that doesn't exist

    expect(component.isBold()).toBe(false);
    expect(component.isItalic()).toBe(false);
    expect(component.isUnderline()).toBe(false);
    expect(component.getCurrentFontSize()).toBe(12);
    expect(component.getCurrentTextColor()).toBe('#000000');
    expect(component.getCurrentBackgroundColor()).toBe('#ffffff');
    expect(component.getCurrentAlignment()).toBe('left');
    expect(component.getCurrentFormula()).toBe('');
  });

  it('should have correct font size options', () => {
    const expectedSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    expect(component.fontSizes).toEqual(expectedSizes);
  });

  it('should have correct alignment options', () => {
    expect(component.alignmentOptions).toEqual([
      { value: 'left', icon: '⬅️', label: 'Left' },
      { value: 'center', icon: '↔️', label: 'Center' },
      { value: 'right', icon: '➡️', label: 'Right' }
    ]);
  });
});
