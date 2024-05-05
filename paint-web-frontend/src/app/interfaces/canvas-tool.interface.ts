/**
 * Interface to represent a canvas tool and it's properties.
 */
export interface CanvasTool {
  /**
   * Name of the tool.
   */
  name: 'paintbrush' | 'eraser' | 'circle' | 'rect';

  /**
   * Line width.
   */
  lineWidth: number;

  /**
   * Line join.
   */
  lineJoin?: 'round' | 'bevel' | 'miter';
}
