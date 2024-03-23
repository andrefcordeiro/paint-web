import { BezierCurve } from './bezier-curver.interface';
import { Point } from './point.interface';

export interface BezierCurveCircle {
  start: Point;

  topBezierCurve: BezierCurve;

  bottomBezierCurve: BezierCurve;

  color: string;
}
