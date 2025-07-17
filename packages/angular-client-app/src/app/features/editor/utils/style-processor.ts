import { ICellStyles } from '../types';

/**
 * Converts ICellStyles to CSS styles object
 * @param styles - The cell styles from the cell model
 * @returns CSS styles object that can be used with ngStyle
 */
export function processStyles(styles?: ICellStyles): Record<string, string> {
  if (!styles) return {};

  const cssStyles: Record<string, string> = {};

  if (styles.backgroundColor) {
    cssStyles['background-color'] = styles.backgroundColor;
  }
  if (styles.textColor) {
    cssStyles['color'] = styles.textColor;
  }
  if (styles.fontSize !== undefined && styles.fontSize !== null) {
    cssStyles['font-size'] = `${styles.fontSize}px`;
  }
  if (styles.alignment) {
    cssStyles['text-align'] = styles.alignment;
  }
  if (styles.bold) {
    cssStyles['font-weight'] = 'bold';
  }
  if (styles.italic) {
    cssStyles['font-style'] = 'italic';
  }
  if (styles.underline) {
    cssStyles['text-decoration'] = cssStyles['text-decoration']
      ? `${cssStyles['text-decoration']} underline`
      : 'underline';
  }

  return cssStyles;
}
