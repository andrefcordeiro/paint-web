import { BezierCurve } from './bezier-curver.interface';
import { Point } from './point.interface';
import { Shape } from './shape';

export class BezierCurveCircle extends Shape {
  start: Point;

  topBezierCurve: BezierCurve;

  bottomBezierCurve: BezierCurve;

  constructor(
    color: string | CanvasGradient | CanvasPattern,
    lineWidth: number,
    start: Point,
    topBezierCurve: BezierCurve,
    bottomBezierCurve: BezierCurve
  ) {
    super('circ', color, lineWidth);
    this.start = start;
    this.topBezierCurve = topBezierCurve;
    this.bottomBezierCurve = bottomBezierCurve;
  }

  /**
   * Method to draw the circle on a canvas.
   * @param context Context of the canvas.
   */
  draw(context: CanvasRenderingContext2D): void {
    const previousColor = context.strokeStyle;
    const previousLineWidth = context.lineWidth;
    const previousFillStyle = context.fillStyle;

    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.beginPath();

    context.moveTo(this.start.x, this.start.y);

    this.drawBezierCurveTo(this.topBezierCurve, context);
    this.drawBezierCurveTo(this.bottomBezierCurve, context);

    context.fill();
    context.stroke();
    context.closePath();

    context.strokeStyle = previousColor;
    context.lineWidth = previousLineWidth;
    context.fillStyle = previousFillStyle;
  }

  /**
   * Draw a Bezier Curve.
   * @param bezierCurve Curve to be drawn.
   */
  private drawBezierCurveTo(bezierCurve: BezierCurve, context: CanvasRenderingContext2D) {
    context.bezierCurveTo(
      bezierCurve.cp1.x,
      bezierCurve.cp1.y,
      bezierCurve.cp2.x,
      bezierCurve.cp2.y,
      bezierCurve.end.x,
      bezierCurve.end.y
    );
  }
}
