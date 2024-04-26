export abstract class Shape {
  type: string;

  color: string | CanvasGradient | CanvasPattern;

  lineWidth: number;

  protected constructor(type: string, 
    color: string | CanvasGradient | CanvasPattern, lineWidth: number) {
    this.type = type;
    this.color = color;
    this.lineWidth = lineWidth;
  }

  abstract draw(context: CanvasRenderingContext2D): void;
}
