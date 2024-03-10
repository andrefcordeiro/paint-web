/**
 * Interface to represent a canvas tool and it's properties.
 */
export interface CanvasTool {
  /**
   * Name of the tool.
   */
  name: 'paintbrush' | 'eraser';

  /**
   * Line width.
   */
  size: number;

  /**
   * Line color.
   */
  color: string | CanvasGradient | CanvasPattern;

  /**
   * Line join.
   */
  lineJoin?: 'round' | 'bevel' | 'miter';
}
