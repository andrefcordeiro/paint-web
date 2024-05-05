import { Point } from '../../interfaces/shapes/point.interface';
import { Shape } from './shape';

interface BezierCurve {
  cp1: Point;

  cp2: Point;

  end: Point;
}

export class Circle extends Shape {
  start: Point;

  topBezierCurve: BezierCurve;

  bottomBezierCurve: BezierCurve;

  constructor(
    color: string | CanvasGradient | CanvasPattern,
    lineWidth: number,
    p?: Point,
    start?: Point
  ) {
    super('circ', color, lineWidth);

    if (!start || !p) return;

    this.start = {
      x: start.x,
      y: start.y + (p.y - start.y) / 2,
    };

    this.topBezierCurve = {
      cp1: { x: start.x, y: start.y },
      cp2: { x: p.x, y: start.y },
      end: { x: p.x, y: start.y + (p.y - start.y) / 2 },
    };

    this.bottomBezierCurve = {
      cp1: { x: p.x, y: p.y },
      cp2: { x: start.x, y: p.y },
      end: { x: start.x, y: start.y + (p.y - start.y) / 2 },
    };
  }

  /**
   * Create a Circle instance from another instance.
   * @param circle
   * @returns Circle
   */
  public static createFromAnotherInstance(circle: Circle): Circle {
    const newCircle = new Circle(circle.color, circle.lineWidth);
    newCircle.start = circle.start;
    newCircle.topBezierCurve = circle.topBezierCurve;
    newCircle.bottomBezierCurve = circle.bottomBezierCurve;

    return newCircle;
  }

  /**
   * Method to draw the circle on a canvas.
   * @param context Context of the canvas.
   */
  draw(context: CanvasRenderingContext2D): void {
    this.setToolPropertiesContext(context);

    context.beginPath();
    context.moveTo(this.start.x, this.start.y);

    this.drawBezierCurveTo(this.topBezierCurve, context);
    this.drawBezierCurveTo(this.bottomBezierCurve, context);

    context.fill();
    context.stroke();
    context.closePath();

    this.unsetToolPropertiesContext(context);
  }

  /**
   * Draw a Bezier Curve.
   * @param bezierCurve Curve to be drawn.
   */
  private drawBezierCurveTo(
    bezierCurve: BezierCurve,
    context: CanvasRenderingContext2D
  ) {
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
