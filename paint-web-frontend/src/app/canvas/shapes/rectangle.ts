import { Point } from '../../interfaces/shapes/point.interface';
import { Shape } from './shape';

export class Rectangle extends Shape {
  x1: number;

  y1: number;

  x2: number;

  y2: number;

  constructor(
    color: string | CanvasGradient | CanvasPattern,
    lineWidth: number,
    p1: Point,
    p2: Point
  ) {
    super('rect', color, lineWidth);
    this.x1 = p1.x;
    this.y1 = p1.y;
    this.x2 = p2.x;
    this.y2 = p2.y;
  }

  /**
   * Method to draw the rectangle on a canvas.
   * @param context Context of the canvas.
   */
  draw(context: CanvasRenderingContext2D): void {
    this.setToolPropertiesContext(context);

    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.beginPath();

    context.rect(this.x1, this.y1, this.x2, this.y2);

    context.fill();
    context.stroke();
    context.closePath();

    this.unsetToolPropertiesContext(context);
  }
}
