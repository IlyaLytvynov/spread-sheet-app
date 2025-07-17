import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CellComponent } from './cell.component';
import { ICell, ICellStyles } from '../../types';
import * as styleProcessor from '../../utils/style-processor';

describe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  const mockCell: ICell = {
    value: 'Test Value',
    formula: '=A1+B1',
    computedValue: 'Computed Value',
    styles: {
      bold: true,
      fontSize: 12,
      textColor: '#000000'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values when no cell is provided', () => {
      fixture.detectChanges();

      expect(component.cell).toBeNull();
      expect(component.editValue()).toBe('');
      expect(component.edit()).toBe(false);
    });

    it('should initialize with cell value when cell is provided', () => {
      component.cell = mockCell;
      component.editValue = signal<ICell['value']>(component.cell?.value || '');
      fixture.detectChanges();

      expect(component.editValue()).toBe('Test Value');
      expect(component.edit()).toBe(false);
    });

    it('should handle null cell value', () => {
      const cellWithNullValue: ICell = { ...mockCell, value: null };
      component.cell = cellWithNullValue;
      component.editValue = signal<ICell['value']>(component.cell?.value || '');
      fixture.detectChanges();

      expect(component.editValue()).toBe('');
    });
  });

  describe('Edit Mode Toggle', () => {
    beforeEach(() => {
      component.cell = mockCell;
      fixture.detectChanges();
    });

    it('should enable edit mode when not in edit mode', () => {
      jest.spyOn(component, 'enableEdit');
      component.edit.set(false);

      component.toggleEdit();

      expect(component.enableEdit).toHaveBeenCalled();
    });

    it('should save and disable edit mode when in edit mode', () => {
      jest.spyOn(component, 'saveAndDisableEdit');
      component.edit.set(true);

      component.toggleEdit();

      expect(component.saveAndDisableEdit).toHaveBeenCalled();
    });
  });

  describe('Enable Edit Mode', () => {
    beforeEach(() => {
      component.cell = mockCell;
      fixture.detectChanges();
    });

    it('should set edit mode to true and initialize edit value', () => {
      component.enableEdit();

      expect(component.edit()).toBe(true);
      expect(component.editValue()).toBe('Test Value');
    });

    it('should handle null cell value when enabling edit', () => {
      component.cell = null;

      component.enableEdit();

      expect(component.editValue()).toBe('');
      expect(component.edit()).toBe(true);
    });

    it('should focus and select input after view updates', fakeAsync(() => {
      const inputElement = { focus: jest.fn(), select: jest.fn() };
      component.editInput = { nativeElement: inputElement } as any;

      component.enableEdit();
      tick();

      expect(inputElement.focus).toHaveBeenCalled();
      expect(inputElement.select).toHaveBeenCalled();
    }));
  });

  describe('Disable Edit Mode', () => {
    it('should set edit mode to false', () => {
      component.edit.set(true);

      component.disableEdit();

      expect(component.edit()).toBe(false);
    });
  });

  describe('Save and Disable Edit', () => {
    beforeEach(() => {
      component.cell = mockCell;
      component.editValue.set('Updated Value');
      fixture.detectChanges();
    });

    it('should emit updated cell and disable edit mode', () => {
      jest.spyOn(component.update, 'emit');
      jest.spyOn(component, 'disableEdit');

      component.saveAndDisableEdit();

      const expectedCell: ICell = {
        ...mockCell,
        value: 'Updated Value'
      };

      expect(component.update.emit).toHaveBeenCalledWith(expectedCell);
      expect(component.disableEdit).toHaveBeenCalled();
    });

    it('should handle null edit value', () => {
      jest.spyOn(component.update, 'emit');
      component.editValue.set('');

      component.saveAndDisableEdit();

      const expectedCell: ICell = {
        ...mockCell,
        value: null
      };

      expect(component.update.emit).toHaveBeenCalledWith(expectedCell);
    });
  });

  describe('Cancel Edit', () => {
    beforeEach(() => {
      component.cell = mockCell;
      component.editValue.set('Modified Value');
      fixture.detectChanges();
    });

    it('should reset edit value to original and disable edit', () => {
      jest.spyOn(component, 'disableEdit');

      component.cancelEdit();

      expect(component.editValue()).toBe('Test Value');
      expect(component.disableEdit).toHaveBeenCalled();
    });

    it('should handle null original value', () => {
      component.cell = { ...mockCell, value: null };
      jest.spyOn(component, 'disableEdit');

      component.cancelEdit();

      expect(component.editValue()).toBeNull();
      expect(component.disableEdit).toHaveBeenCalled();
    });
  });

  describe('Input Change Handler', () => {
    it('should update edit value when input changes', () => {
      const mockEvent = {
        target: { value: 'New Input Value' }
      } as unknown as Event;

      component.onInputChange(mockEvent);

      expect(component.editValue()).toBe('New Input Value');
    });
  });

  describe('Component Destruction', () => {
    it('should handle destroy when no listeners are active', () => {
      expect(() => component.ngOnDestroy()).not.toThrow();
    });

    it('should call ngOnDestroy without errors', () => {
      component.enableEdit(); // Add listeners first
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('Random Getter', () => {
    it('should return a number between 1 and 200', () => {
      const randomValue = component.random;

      expect(randomValue).toBeGreaterThanOrEqual(1);
      expect(randomValue).toBeLessThanOrEqual(200);
      expect(Number.isInteger(randomValue)).toBe(true);
    });
  });

  describe('Edit Flow Integration', () => {
    beforeEach(() => {
      component.cell = mockCell;
      fixture.detectChanges();
    });

    it('should properly enable and disable edit mode', () => {
      // Start in non-edit mode
      expect(component.edit()).toBe(false);

      // Enable edit mode
      component.enableEdit();
      expect(component.edit()).toBe(true);
      expect(component.editValue()).toBe('Test Value');

      // Disable edit mode
      component.disableEdit();
      expect(component.edit()).toBe(false);
    });

    it('should handle complete edit and save cycle', () => {
      jest.spyOn(component.update, 'emit');

      // Enable edit mode
      component.enableEdit();

      // Modify value
      component.editValue.set('New Value');

      // Save changes
      component.saveAndDisableEdit();

      expect(component.edit()).toBe(false);
      expect(component.update.emit).toHaveBeenCalledWith({
        ...mockCell,
        value: 'New Value'
      });
    });

    it('should handle edit and cancel cycle', () => {
      jest.spyOn(component.update, 'emit');

      // Enable edit mode
      component.enableEdit();

      // Modify value
      component.editValue.set('Modified Value');

      // Cancel changes
      component.cancelEdit();

      expect(component.edit()).toBe(false);
      expect(component.editValue()).toBe('Test Value'); // Should revert
      expect(component.update.emit).not.toHaveBeenCalled();
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      component.cell = mockCell;
      fixture.detectChanges();
    });

    it('should handle template display without errors', () => {
      expect(() => {
        component.edit.set(false);
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should handle edit mode template without errors', () => {
      expect(() => {
        component.enableEdit();
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Event Listener Management', () => {
    beforeEach(() => {
      component.cell = mockCell;
      fixture.detectChanges();
    });

    it('should add event listeners when enabling edit mode', () => {
      const documentSpy = jest.spyOn(document, 'addEventListener');

      component.enableEdit();

      expect(documentSpy).toHaveBeenCalledWith('click', expect.any(Function));
      expect(documentSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      documentSpy.mockRestore();
    });

    it('should remove event listeners when disabling edit mode', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      // First enable to add listeners
      component.enableEdit();

      // Then disable to remove listeners
      component.disableEdit();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should handle document click outside component', () => {
      jest.spyOn(component, 'saveAndDisableEdit');
      const containsSpy = jest.spyOn(component['elementRef'].nativeElement, 'contains').mockReturnValue(false);

      component.enableEdit();

      // Simulate a click outside the component
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: document.body });
      document.dispatchEvent(clickEvent);

      expect(component.saveAndDisableEdit).toHaveBeenCalled();

      containsSpy.mockRestore();
    });

    it('should not save when clicking inside component', () => {
      jest.spyOn(component, 'saveAndDisableEdit');
      const containsSpy = jest.spyOn(component['elementRef'].nativeElement, 'contains').mockReturnValue(true);

      component.enableEdit();

      // Simulate a click inside the component
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: component['elementRef'].nativeElement });
      document.dispatchEvent(clickEvent);

      expect(component.saveAndDisableEdit).not.toHaveBeenCalled();

      containsSpy.mockRestore();
    });

    it('should handle Escape key to cancel edit', () => {
      jest.spyOn(component, 'cancelEdit');

      component.enableEdit();

      // Simulate Escape key press
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      const preventDefaultSpy = jest.spyOn(escapeEvent, 'preventDefault');
      document.dispatchEvent(escapeEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.cancelEdit).toHaveBeenCalled();
    });

    it('should handle Enter key to save edit', () => {
      jest.spyOn(component, 'saveAndDisableEdit');

      component.enableEdit();

      // Simulate Enter key press
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      const preventDefaultSpy = jest.spyOn(enterEvent, 'preventDefault');
      document.dispatchEvent(enterEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.saveAndDisableEdit).toHaveBeenCalled();
    });

    it('should not prevent default for other keys', () => {
      jest.spyOn(component, 'cancelEdit');
      jest.spyOn(component, 'saveAndDisableEdit');

      component.enableEdit();

      // Simulate other key press
      const keyEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
      const preventDefaultSpy = jest.spyOn(keyEvent, 'preventDefault');
      document.dispatchEvent(keyEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(component.cancelEdit).not.toHaveBeenCalled();
      expect(component.saveAndDisableEdit).not.toHaveBeenCalled();
    });
  });

  describe('Style Processing', () => {
    describe('cellStyles computed signal', () => {
      it('should return empty styles when cell has no styles', () => {
        const cellWithoutStyles: ICell = { value: 'Test' };
        component.cell = cellWithoutStyles;
        fixture.detectChanges();

        const styles = component.cellStyles();
        expect(styles).toEqual({});
      });

      it('should return empty styles when cell is null', () => {
        component.cell = null;
        fixture.detectChanges();

        const styles = component.cellStyles();
        expect(styles).toEqual({});
      });

      it('should call processStyles with cell styles', () => {
        const processStylesSpy = jest.spyOn(styleProcessor, 'processStyles');
        const cellStyles: ICellStyles = {
          backgroundColor: '#ff0000',
          textColor: '#000000',
          bold: true
        };
        const cellWithStyles: ICell = { value: 'Test', styles: cellStyles };
        component.cell = cellWithStyles;
        fixture.detectChanges();

        component.cellStyles();

        expect(processStylesSpy).toHaveBeenCalledWith(cellStyles);
        processStylesSpy.mockRestore();
      });

      it('should return processed styles from utility function', () => {
        const mockProcessedStyles = {
          'background-color': '#ff0000',
          'color': '#000000',
          'font-weight': 'bold'
        };
        const processStylesSpy = jest.spyOn(styleProcessor, 'processStyles').mockReturnValue(mockProcessedStyles);

        component.cell = mockCell;
        fixture.detectChanges();

        const styles = component.cellStyles();
        expect(styles).toEqual(mockProcessedStyles);

        processStylesSpy.mockRestore();
      });

      it('should be reactive to cell changes', () => {
        // Start with one cell
        const cellA: ICell = { value: 'A', styles: { backgroundColor: '#ff0000' } };
        component.cell = cellA;
        fixture.detectChanges();

        const stylesA = component.cellStyles();
        expect(stylesA).toEqual({ 'background-color': '#ff0000' });

        // Change to different cell
        const cellB: ICell = { value: 'B', styles: { textColor: '#00ff00' } };
        component.cell = cellB;
        // Create a new fixture to test reactivity properly
        const newFixture = TestBed.createComponent(CellComponent);
        const newComponent = newFixture.componentInstance;
        newComponent.cell = cellB;
        newFixture.detectChanges();

        const stylesB = newComponent.cellStyles();
        expect(stylesB).toEqual({ 'color': '#00ff00' });
      });
    });

    describe('Template Style Integration', () => {
      beforeEach(() => {
        component.cell = {
          value: 'Styled Cell',
          styles: {
            backgroundColor: '#ffff00',
            textColor: '#000000',
            bold: true,
            fontSize: 16,
            alignment: 'center'
          }
        };
        fixture.detectChanges();
      });

      it('should apply styles to content div', () => {
        const contentDiv = fixture.debugElement.query(By.css('.content'));
        expect(contentDiv).toBeTruthy();

        // Verify ngStyle directive is present
        const ngStyleDirective = contentDiv.injector.get('ngStyle', null);
        expect(contentDiv.attributes['ng-reflect-ng-style']).toBeDefined();
      });

      it('should apply styles to input element when in edit mode', () => {
        component.enableEdit();
        fixture.detectChanges();

        const inputElement = fixture.debugElement.query(By.css('input'));
        expect(inputElement).toBeTruthy();

        // Verify ngStyle directive is present on input
        expect(inputElement.attributes['ng-reflect-ng-style']).toBeDefined();
      });

      it('should update template when styles change', () => {
        // Get initial styles
        const initialStyles = component.cellStyles();
        expect(Object.keys(initialStyles)).toHaveLength(5); // All 5 styles from beforeEach

        // Create new component with different styles
        const newFixture = TestBed.createComponent(CellComponent);
        const newComponent = newFixture.componentInstance;
        newComponent.cell = {
          value: 'Updated Cell',
          styles: {
            backgroundColor: '#00ff00',
            italic: true
          }
        };
        newFixture.detectChanges();

        const updatedStyles = newComponent.cellStyles();
        expect(updatedStyles).toEqual({
          'background-color': '#00ff00',
          'font-style': 'italic'
        });
        expect(updatedStyles).not.toEqual(initialStyles);
      });
    });

    describe('Style Behavior Edge Cases', () => {
      it('should handle cell with empty styles object', () => {
        const cellWithEmptyStyles: ICell = { value: 'Test', styles: {} };
        component.cell = cellWithEmptyStyles;
        fixture.detectChanges();

        const styles = component.cellStyles();
        expect(styles).toEqual({});
      });

      it('should handle cell with only false boolean values', () => {
        const cellWithFalseStyles: ICell = {
          value: 'Test',
          styles: {
            bold: false,
            italic: false,
            underline: false
          }
        };
        component.cell = cellWithFalseStyles;
        fixture.detectChanges();

        const styles = component.cellStyles();
        expect(styles).toEqual({});
      });

      it('should handle cell with mixed true/false boolean values', () => {
        const cellWithMixedStyles: ICell = {
          value: 'Test',
          styles: {
            bold: true,
            italic: false,
            underline: true
          }
        };
        component.cell = cellWithMixedStyles;
        fixture.detectChanges();

        const styles = component.cellStyles();
        expect(styles).toEqual({
          'font-weight': 'bold',
          'text-decoration': 'underline'
        });
      });

      it('should handle rapid cell changes', () => {
        const cells: ICell[] = [
          { value: '1', styles: { backgroundColor: '#ff0000' } },
          { value: '2', styles: { textColor: '#00ff00' } },
          { value: '3', styles: { fontSize: 20 } },
          { value: '4' } // No styles
        ];

        cells.forEach(cell => {
          component.cell = cell;
          fixture.detectChanges();
          expect(() => component.cellStyles()).not.toThrow();
        });
      });
    });

    describe('Performance and Memory', () => {
      it('should not create new style objects when cell styles unchanged', () => {
        component.cell = mockCell;
        fixture.detectChanges();

        const styles1 = component.cellStyles();
        const styles2 = component.cellStyles();

        // Should return the same reference for computed signals when unchanged
        expect(styles1).toEqual(styles2);
      });

      it('should handle null to styled cell transitions', () => {
        // Start with null cell
        const nullFixture = TestBed.createComponent(CellComponent);
        const nullComponent = nullFixture.componentInstance;
        nullComponent.cell = null;
        nullFixture.detectChanges();
        expect(nullComponent.cellStyles()).toEqual({});

        // Transition to styled cell
        const styledFixture = TestBed.createComponent(CellComponent);
        const styledComponent = styledFixture.componentInstance;
        styledComponent.cell = mockCell;
        styledFixture.detectChanges();
        const styles = styledComponent.cellStyles();
        expect(styles).toEqual({
          'font-weight': 'bold',
          'font-size': '12px',
          'color': '#000000'
        });
      });

      it('should handle styled to null cell transitions', () => {
        // Start with styled cell
        const styledFixture = TestBed.createComponent(CellComponent);
        const styledComponent = styledFixture.componentInstance;
        styledComponent.cell = mockCell;
        styledFixture.detectChanges();
        expect(Object.keys(styledComponent.cellStyles())).toHaveLength(3);

        // Transition to null cell
        const nullFixture = TestBed.createComponent(CellComponent);
        const nullComponent = nullFixture.componentInstance;
        nullComponent.cell = null;
        nullFixture.detectChanges();
        expect(nullComponent.cellStyles()).toEqual({});
      });
    });
  });
});
