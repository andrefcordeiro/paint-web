import { CanvasTool } from './canvas-tool.interface';
import { BezierCurveCircle } from './shapes/bezier-curve-circle.interface';
import { Line } from './shapes/line.interface';
import { Rectangle } from './shapes/rectangle.interface';

export interface CanvasState {
  latestOperation: string;
  // latestOperation: 'drawing' | 'globalPropertiesChanged';

  color: string;

  toolsState: CanvasTool[];

  lines: Line[];

  circles: BezierCurveCircle[];

  rectangles: Rectangle[];
}