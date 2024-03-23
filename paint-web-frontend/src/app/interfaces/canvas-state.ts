import { CanvasTool } from './canvas-tool.interface';
import { BezierCurveCircle } from './shapes/bezier-curve-circle.interface';

export interface CanvasState {
  latestOperation: string;
  // latestOperation: 'drawing' | 'globalPropertiesChanged';

  color: string;

  toolsState: CanvasTool[];

  circles: BezierCurveCircle[];
}
