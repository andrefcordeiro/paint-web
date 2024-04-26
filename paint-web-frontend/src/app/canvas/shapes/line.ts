import { Point } from '../../interfaces/shapes/point.interface';
import { Shape } from './shape';

export class Line extends Shape {
  points: Point[] = [];

  constructor(
    color: string | CanvasGradient | CanvasPattern,
    lineWidth: number,
    points: Point[] = []
  ) {
    super('line', color, lineWidth);
    this.points = points;
  }

  pushPoint(point: Point) {
    this.points.push(point);
  }

   /**
   * Method to draw the line on a canvas.
   * @param context Context of the canvas.
   */
  draw(context: CanvasRenderingContext2D): void {
    const previousColor = context.strokeStyle;
    const previousLineWidth = context.lineWidth;

    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.color;
    context.beginPath();

    this.points.forEach((p) => {
      context.lineTo(p.x, p.y);
    });

    context.stroke();
    context.closePath();
    
    context.strokeStyle = previousColor;
    context.lineWidth = previousLineWidth;
  }
}
