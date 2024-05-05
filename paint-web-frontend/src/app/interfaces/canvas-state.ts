import { CanvasTool } from './canvas-tool.interface';
import { Shape } from '../canvas/shapes/shape';

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
   * Shapes drawn on the canvas.
   */
  shapes: Shape[];

  /**
   * Flag to determine if changes on canvas are allowed.
   */
  disabled: boolean;

  /**
   * Selected tool.
   */
  selectedTool: CanvasTool;
}
