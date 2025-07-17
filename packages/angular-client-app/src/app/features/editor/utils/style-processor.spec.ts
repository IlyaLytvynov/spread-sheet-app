import { processStyles } from './style-processor';
import { ICellStyles } from '../types';

describe('processStyles', () => {
  it('should return empty object when styles is undefined', () => {
    const result = processStyles();
    expect(result).toEqual({});
  });

  it('should return empty object when styles is null', () => {
    const result = processStyles(undefined);
    expect(result).toEqual({});
  });

  it('should return empty object when styles is empty', () => {
    const result = processStyles({});
    expect(result).toEqual({});
  });

  it('should convert backgroundColor to background-color CSS property', () => {
    const styles: ICellStyles = { backgroundColor: '#ff0000' };
    const result = processStyles(styles);
    expect(result).toEqual({ 'background-color': '#ff0000' });
  });

  it('should convert textColor to color CSS property', () => {
    const styles: ICellStyles = { textColor: '#00ff00' };
    const result = processStyles(styles);
    expect(result).toEqual({ 'color': '#00ff00' });
  });

  it('should convert fontSize to font-size CSS property with px units', () => {
    const styles: ICellStyles = { fontSize: 16 };
    const result = processStyles(styles);
    expect(result).toEqual({ 'font-size': '16px' });
  });

  it('should convert alignment to text-align CSS property', () => {
    const styles: ICellStyles = { alignment: 'center' };
    const result = processStyles(styles);
    expect(result).toEqual({ 'text-align': 'center' });
  });

  it('should handle all alignment values', () => {
    expect(processStyles({ alignment: 'left' })).toEqual({ 'text-align': 'left' });
    expect(processStyles({ alignment: 'center' })).toEqual({ 'text-align': 'center' });
    expect(processStyles({ alignment: 'right' })).toEqual({ 'text-align': 'right' });
  });

  it('should convert bold to font-weight CSS property', () => {
    const styles: ICellStyles = { bold: true };
    const result = processStyles(styles);
    expect(result).toEqual({ 'font-weight': 'bold' });
  });

  it('should not set font-weight when bold is false', () => {
    const styles: ICellStyles = { bold: false };
    const result = processStyles(styles);
    expect(result).toEqual({});
  });

  it('should convert italic to font-style CSS property', () => {
    const styles: ICellStyles = { italic: true };
    const result = processStyles(styles);
    expect(result).toEqual({ 'font-style': 'italic' });
  });

  it('should not set font-style when italic is false', () => {
    const styles: ICellStyles = { italic: false };
    const result = processStyles(styles);
    expect(result).toEqual({});
  });

  it('should convert underline to text-decoration CSS property', () => {
    const styles: ICellStyles = { underline: true };
    const result = processStyles(styles);
    expect(result).toEqual({ 'text-decoration': 'underline' });
  });

  it('should not set text-decoration when underline is false', () => {
    const styles: ICellStyles = { underline: false };
    const result = processStyles(styles);
    expect(result).toEqual({});
  });

  it('should handle multiple styles combined', () => {
    const styles: ICellStyles = {
      backgroundColor: '#ffff00',
      textColor: '#000000',
      fontSize: 14,
      alignment: 'right',
      bold: true,
      italic: true,
      underline: true
    };
    const result = processStyles(styles);
    expect(result).toEqual({
      'background-color': '#ffff00',
      'color': '#000000',
      'font-size': '14px',
      'text-align': 'right',
      'font-weight': 'bold',
      'font-style': 'italic',
      'text-decoration': 'underline'
    });
  });

  it('should handle partial styles', () => {
    const styles: ICellStyles = {
      backgroundColor: '#00ff00',
      bold: true,
      alignment: 'left'
    };
    const result = processStyles(styles);
    expect(result).toEqual({
      'background-color': '#00ff00',
      'font-weight': 'bold',
      'text-align': 'left'
    });
  });

  it('should handle zero fontSize', () => {
    const styles: ICellStyles = { fontSize: 0 };
    const result = processStyles(styles);
    expect(result).toEqual({ 'font-size': '0px' });
  });

  it('should handle large fontSize', () => {
    const styles: ICellStyles = { fontSize: 100 };
    const result = processStyles(styles);
    expect(result).toEqual({ 'font-size': '100px' });
  });
});
