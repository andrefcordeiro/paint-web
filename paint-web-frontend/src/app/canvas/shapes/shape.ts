interface ContextProperties {
  lineWidth: number;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  fillStyle: string | CanvasGradient | CanvasPattern;
}

export abstract class Shape {
  type: string;

  color: string | CanvasGradient | CanvasPattern;

  lineWidth: number;

  origContextProperties: ContextProperties;

  protected constructor(
    type: string,
    color: string | CanvasGradient | CanvasPattern,
    lineWidth: number
  ) {
    this.type = type;
    this.color = color;
    this.lineWidth = lineWidth;
  }

  abstract draw(context: CanvasRenderingContext2D): void;

  /**
   * Method that set the properties of the tool on the canvas context.
   * @param context Context of the canvas.
   */
  protected setToolPropertiesContext(context: CanvasRenderingContext2D) {
    this.origContextProperties = {
      lineWidth: context.lineWidth,
      strokeStyle: context.strokeStyle,
      fillStyle: context.fillStyle,
    };
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
  }

  /**
   * Method that restore the original properties of the canvas context.
   * @param context Context of the canvas.
   */
  protected unsetToolPropertiesContext(
    context: CanvasRenderingContext2D
  ): void {
    context.lineWidth = this.origContextProperties.lineWidth;
    context.strokeStyle = this.origContextProperties.strokeStyle;
    context.fillStyle = this.origContextProperties.fillStyle;
  }
}
