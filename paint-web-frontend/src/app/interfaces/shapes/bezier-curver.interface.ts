import { Point } from './point.interface';

export interface BezierCurve {
  cp1: Point;

  cp2: Point;

  end: Point;
}
