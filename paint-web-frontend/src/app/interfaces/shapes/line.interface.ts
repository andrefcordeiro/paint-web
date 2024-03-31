import { Point } from './point.interface';

export interface Line {
  points: Point[];

  color: string | CanvasGradient | CanvasPattern;

  lineWidth: number;
}
