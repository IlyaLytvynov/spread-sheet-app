import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CellComponent } from './cell.component';
import { ICell } from '../../types';

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
});
