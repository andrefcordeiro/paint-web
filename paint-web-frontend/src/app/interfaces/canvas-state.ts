import { CanvasTool } from './canvas-tool.interface';
import { BezierCurveCircle } from './shapes/bezier-curve-circle.interface';
import { Line } from './shapes/line.interface';
import { Rectangle } from './shapes/rectangle.interface';

export interface CanvasState {
  /**
   * Latest operation executed on the canvas.
   */
  latestOperation: string;
  // latestOperation: 'drawing' | 'globalPropertiesChanged';

  /**
   * Canvas context color.
   */
  color: string;

  /**
   * Canvas tools state.
   */
  toolsState: CanvasTool[];

  /**
   * Lines drawn on the canvas.
   */
  lines: Line[];

  /**
   * Circles drawn on the canvas.
   */
  circles: BezierCurveCircle[];

  /**
   * Rectangles drawn on the canvas.
   */
  rectangles: Rectangle[];

  /**
   * Flag to determine if changes on canvas are allowed.
   */
  disabled: boolean;

  /**
   * Selected tool.
   */
  selectedTool: CanvasTool;
}
