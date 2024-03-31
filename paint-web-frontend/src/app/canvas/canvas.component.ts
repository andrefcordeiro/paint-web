import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalToolPropertiesComponent } from './modal-tool-properties/modal-tool-properties.component';
import { CanvasTool } from '../interfaces/canvas-tool.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { CanvasMemento } from '../interfaces/canvas-memento';
import { CaretakerService } from '../state-management/caretaker.service';
import { CanvasState } from '../interfaces/canvas-state';
import { Point } from '../interfaces/shapes/point.interface';
import { BezierCurve } from '../interfaces/shapes/bezier-curver.interface';
import { BezierCurveCircle } from '../interfaces/shapes/bezier-curve-circle.interface';
import { Line } from '../interfaces/shapes/line.interface';
import { Rectangle } from '../interfaces/shapes/rectangle.interface';
import { Memento } from '../state-management/memento.interface';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {
  /**
   * Canvas.
   */
  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  /**
   * Context.
   */
  context: CanvasRenderingContext2D;

  /**
   * Background color of the canvas.
   */
  backgroundColor = 'white';

  /**
   * Form with global properties that can be set on the top panel.
   */
  public globalPropertiesForm: FormGroup;

  /**
   * Flag that determines whether the left mouse button is being pressed.
   */
  mouseDown = false;

  /**
   * Available tools.
   */
  tools = [
    {
      name: 'paintbrush',
      iconName: 'brush icon',
      onclickFunction: this.setSelectedTool.bind(this),
    },
    {
      name: 'eraser',
      iconName: 'stop icon',
      onclickFunction: this.setSelectedTool.bind(this),
    },
    {
      name: 'circle',
      iconName: 'panorama_fish_eye icon',
      onclickFunction: this.setSelectedTool.bind(this),
    },
    {
      name: 'clear',
      iconName: 'delete icon',
      onclickFunction: this.clearContent.bind(this),
    },
    {
      name: 'save-canvas',
      iconName: 'get_app icon',
      onclickFunction: this.downloadImage.bind(this),
    },
  ];

  /**
   * Selected tool.
   */
  selectedTool: CanvasTool;

  /**
   * Coordinates to draw circle with bezier curve.
   */
  start: Point;

  /**
   * State of the canvas.
   */
  canvasState: CanvasState;

  /**
   * Latest operation applied to the canvas.
   */
  latestOperation = 'drawing';

  /**
   * Latest bezierCurveCircle drawn
   */
  bezierCurveCircle: BezierCurveCircle | null;

  /**
   * Current line being drawn on the canvas.
   */
  line: Line;

  /**
   * Flag to determine if changes on canvas are allowed.
   */
  canvasDisabled = false;

  /**
   * Returns the nativeElement of the canvas.
   */
  get canvasElement(): HTMLCanvasElement {
    return this.canvas.nativeElement;
  }

  /**
   * Returns the 'color' FormControl of the globalPropertiesForm.
   */
  get color(): FormControl {
    return this.globalPropertiesForm.get('color') as FormControl;
  }

  /**
   *
   * @param dialog Component to render modals.
   * @param caretakerService Service for state management.
   */
  constructor(
    public dialog: MatDialog,
    private caretakerService: CaretakerService
  ) {}

  ngOnInit() {
    this.initializeCanvasToolsState();
  }

  ngAfterViewInit() {
    this.createCanvas();
  }

  /**
   * Initialize the state of the canvas tools.
   */
  private initializeCanvasToolsState() {
    const paintbrush: CanvasTool = { name: 'paintbrush', lineWidth: 5 };
    const eraser: CanvasTool = { name: 'eraser', lineWidth: 5 };
    const circle: CanvasTool = { name: 'circle', lineWidth: 5 };

    this.selectedTool = paintbrush;
    const toolsState = [paintbrush, eraser, circle];

    this.canvasState = {
      latestOperation: 'none',
      color: 'black',
      toolsState: toolsState,
      lines: [],
      circles: [],
      rectangles: [],
    };

    this.initializeGlobalPropertiesForm();
  }

  /**
   * Initialize global properties.
   */
  private initializeGlobalPropertiesForm() {
    this.globalPropertiesForm = new FormGroup({
      color: new FormControl('black'),
    });
  }

  /**
   * Method called whenever the color input is changed.
   */
  onColorChange() {
    if (this.selectedTool.name !== 'eraser') {
      this.saveState('globalPropertiesChanged');

      this.canvasState.color = this.color.value;
      this.context.strokeStyle = this.color.value;
    }
  }

  /**
   * Function to initialize canvas properties.
   */
  private createCanvas() {
    this.canvasElement.style.width = '100%';
    this.canvasElement.style.height = '100%';

    this.canvasElement.width = this.canvasElement.offsetWidth;
    this.canvasElement.height = this.canvasElement.offsetHeight;

    this.context = this.canvasElement.getContext('2d')!;
    this.setToolPropertiesContext();
  }

  /**
   * Return the mouse point minus the canvas offset.
   * @param x
   * @param y
   * @returns Point
   */
  private getMouseCoordMinusOffset(x: number, y: number): Point {
    return {
      x: x - this.canvasElement.offsetLeft,
      y: y - this.canvasElement.offsetTop,
    };
  }

  /**
   * Mouse events.
   */
  onMouseDown(e: MouseEvent) {
    if (e.button !== 0 || this.canvasDisabled) return;

    this.mouseDown = true;
    const p = this.getMouseCoordMinusOffset(e.clientX, e.clientY);

    switch (this.selectedTool.name) {
      case 'paintbrush':
      case 'eraser':
        this.line = {
          points: [],
          color: this.context.strokeStyle,
          lineWidth: this.context.lineWidth,
        };

        this.saveState('drawing');
        this.context.beginPath();
        break;

      case 'circle':
        this.saveState('drawing');
        this.start = p;
        break;
    }
  }

  onMouseUp(e: MouseEvent) {
    switch (this.selectedTool.name) {
      case 'paintbrush':
      case 'eraser':
        if (this.line) this.canvasState.lines.push(this.line);
        break;

      case 'circle':
        if (this.bezierCurveCircle)
          this.canvasState.circles.push(this.bezierCurveCircle);
        this.bezierCurveCircle = null;
        break;
    }

    this.mouseDown = false;
    this.context.closePath();
  }

  onMouseMove(e: MouseEvent) {
    if (this.mouseDown) {
      const p = this.getMouseCoordMinusOffset(e.clientX, e.clientY);

      switch (this.selectedTool.name) {
        case 'paintbrush':
        case 'eraser':
          this.draw(p.x, p.y);
          break;

        case 'circle':
          this.drawCircle(p.x, p.y);
          break;
      }
    }
  }

  onMouseOut() {
    this.mouseDown = false;
  }

  /**
   * Function to handle keyboard event and change selected tool.
   * @param e Keyboard event.
   */
  @HostListener('document:keyup', ['$event'])
  private handleKeyboardEvent(e: KeyboardEvent) {
    const key = e.key;
    const controlKeys = ['e', 'b'];

    if (e.ctrlKey && (key === 'z' || key === 'Z')) {
      if (e.shiftKey) {
        this.redoOperation();
      } else {
        this.undoOperation(true);
      }
    } else if (controlKeys.includes(key)) {
      const keysTools: { [key: string]: string } = {
        e: 'eraser',
        b: 'paintbrush',
      };

      this.setSelectedTool(keysTools[key]);
    }
  }

  /**
   * Draw on the canvas.
   * @param x X coordinate.
   * @param y Y coordinate.
   */
  private draw(x: number, y: number) {
    this.context.lineTo(x, y);
    this.context.stroke();
    this.line.points.push({ x, y });
  }

  /**
   * Redraw line after the state is restored.
   * @param line
   */
  private redrawLineOnStageRestore(line: Line) {
    const previousColor = this.context.strokeStyle;

    this.context.lineWidth = line.lineWidth;
    this.context.strokeStyle = line.color;
    this.context.beginPath();

    line.points.forEach((p) => {
      this.context.lineTo(p.x, p.y);
    });

    this.context.stroke();
    this.context.closePath();
    this.context.lineWidth = this.selectedTool.lineWidth;
    this.context.strokeStyle = previousColor;
  }

  /**
   * Draw circle on the canvas.
   * @param x X coordinate.
   * @param y Y coordinate.
   */
  private async drawCircle(x: number, y: number) {
    // restoring canvas state everytime a new circle is drawn
    this.undoOperation(false);
    this.saveState('drawing');

    this.context.beginPath();

    const start: Point = {
      x: this.start.x,
      y: this.start.y + (y - this.start.y) / 2,
    };
    this.context.moveTo(start.x, start.y);

    const topBezierCurve: BezierCurve = {
      cp1: { x: this.start.x, y: this.start.y },
      cp2: { x, y: this.start.y },
      end: { x, y: this.start.y + (y - this.start.y) / 2 },
    };

    this.drawBezierCurveTo(topBezierCurve);

    const bottomBezierCurve: BezierCurve = {
      cp1: { x, y },
      cp2: { x: this.start.x, y },
      end: { x: this.start.x, y: this.start.y + (y - this.start.y) / 2 },
    };

    this.drawBezierCurveTo(bottomBezierCurve);

    this.context.stroke();
    this.context.closePath();

    this.bezierCurveCircle = {
      start,
      topBezierCurve,
      bottomBezierCurve,
      color: this.color.value,
      lineWidth: this.context.lineWidth,
    };
  }

  /**
   * Draw a Bezier Curvel.
   * @param bezierCurve Curve to be drawn.
   */
  private drawBezierCurveTo(bezierCurve: BezierCurve) {
    this.context.bezierCurveTo(
      bezierCurve.cp1.x,
      bezierCurve.cp1.y,
      bezierCurve.cp2.x,
      bezierCurve.cp2.y,
      bezierCurve.end.x,
      bezierCurve.end.y
    );
  }

  /**
   * Redraw circle after the state is restored.
   * @param circle
   */
  private redrawCircleOnStageRestore(circle: BezierCurveCircle) {
    this.context.lineWidth = circle.lineWidth;
    this.context.strokeStyle = circle.color;
    this.context.beginPath();

    this.context.moveTo(circle.start.x, circle.start.y);

    this.drawBezierCurveTo(circle.topBezierCurve);
    this.drawBezierCurveTo(circle.bottomBezierCurve);

    this.context.stroke();
    this.context.closePath();

    this.context.lineWidth = this.selectedTool.lineWidth;
    this.context.strokeStyle = this.color.value;
  }

  /**
   * Redraw a rectangle after the state is restored.
   * @param rect
   */
  private redrawRectangleOnStageRestore(rect: Rectangle) {
    this.context.lineWidth = rect.lineWidth;
    this.context.strokeStyle = rect.color;

    this.context.beginPath();

    this.context.rect(rect.x1, rect.y1, rect.x2, rect.y2);

    this.context.stroke();
    this.context.closePath();

    this.context.lineWidth = this.selectedTool.lineWidth;
    this.context.strokeStyle = this.color.value;
  }

  /**
   * Clear all page content before redrawing content on state restore.
   */
  clearContentOnStageRestore() {
    this.context.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
  }

  /**
   * Clear all page content.
   */
  clearContent() {
    this.saveState('drawing');

    const rect: Rectangle = {
      x1: 0,
      y1: 0,
      x2: this.canvasElement.width,
      y2: this.canvasElement.height,
      color: 'white',
      lineWidth: 0,
    };
    this.context.clearRect(rect.x1, rect.y1, rect.x2, rect.y2);

    // removing stored shapes
    this.canvasState.circles = [];
    this.canvasState.lines = [];
    this.canvasState.rectangles = [];

    this.canvasState.rectangles.push(rect);
  }

  /**
   * Executed when tool is changed.
   * @param tool Selected tool.
   */
  private setSelectedTool(name: string) {
    const selectedToolState: CanvasTool | undefined =
      this.canvasState.toolsState.find((tState) => tState.name === name);

    if (selectedToolState) {
      this.selectedTool = selectedToolState;
      this.setToolPropertiesContext();
    }

    // enabling/disabling color input
    if (['paintbrush', 'circle'].includes(name)) {
      this.color.enable();
    } else {
      this.color.disable();
    }
  }

  /**
   * Update the stored state of the selected tool.
   * @param tool Selected tool.
   */
  private updateSelectedToolState(tool: CanvasTool) {
    const indexToolState = this.canvasState.toolsState.findIndex(
      (tState) => tState.name === tool.name
    );

    this.canvasState.toolsState[indexToolState] = tool;
    this.selectedTool = tool;
    this.setToolPropertiesContext();
  }

  /**
   * Set the properties of the selected tool in the canvas context.
   */
  private setToolPropertiesContext() {
    if (this.selectedTool.name === 'eraser') {
      this.context.strokeStyle = this.backgroundColor;
    }
    if (['paintbrush', 'circle'].includes(this.selectedTool.name)) {
      this.context.strokeStyle = this.color.value;
    }
    this.context.lineWidth = this.selectedTool.lineWidth;
    this.context.lineJoin = 'round';
  }

  /**
   * Function called when the user right click on the canvas.
   * @param e Mouse event.
   */
  onRightClick(e: MouseEvent) {
    e.preventDefault();
    const dialogRef = this.dialog.open(ModalToolPropertiesComponent, {
      data: this.selectedTool,
      width: '300px',
      height: '250px',
    });

    dialogRef.afterClosed().subscribe((data: CanvasTool) => {
      if (data) {
        this.saveState('toolPropertiesChanged');
        this.updateSelectedToolState(data);
      }
    });
  }

  /**
   * Function called to download the canvas content as an image.
   */
  downloadImage() {
    var image = this.canvasElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Function to handle the window resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.canvasElement.width = this.canvasElement.offsetWidth;
    this.canvasElement.height = this.canvasElement.offsetHeight;
  }

  /**
   * State management.
   */

  /**
   * Create the memento class from canvas state.
   *
   * @param latestOperation Operation that defines that state.
   * @returns Memento that represents the current state.
   */
  private createMementoFromState(latestOperation: string): Memento {
    this.canvasState.latestOperation = latestOperation;
    return new CanvasMemento(JSON.parse(JSON.stringify(this.canvasState)));
  }

  /**
   * Saves the current canvas state.
   *
   * @param currentOperation Operation that triggered the save state method.
   */
  private saveState(currentOperation: string) {
    const memento = this.createMementoFromState(this.latestOperation);
    this.caretakerService.pushMemento(memento);
    this.latestOperation = currentOperation;
  }

  /**
   * Method executed when user press ctrl+z to undo the current operation.
   */
  private undoOperation(saveCurrentState: boolean) {
    let currentState = null;
    if (saveCurrentState) {
      currentState = this.createMementoFromState(this.latestOperation);
    }
    const memento = this.caretakerService.popMemento(
      currentState
    ) as CanvasMemento;

    if (memento) this.restoreState(memento);
  }

  /**
   * Method executed when user press ctrl+shift+z to redo the latest operation.
   */
  private redoOperation() {
    const memento = this.caretakerService.popPastMemento() as CanvasMemento;
    if (!memento) return;
    this.saveState(memento.getLatestOperation());

    this.restoreState(memento);
  }

  /**
   * Restores the canvas state stored in the memento.
   */
  private restoreState(memento: Memento) {
    this.canvasState = memento.getState();

    switch (this.latestOperation) {
      case 'drawing':
        this.clearContentOnStageRestore();
        // redrawing content
        this.canvasState.circles.forEach((circle: BezierCurveCircle) => {
          this.redrawCircleOnStageRestore(circle);
        });

        this.canvasState.lines.forEach((line: Line) => {
          this.redrawLineOnStageRestore(line);
        });

        this.canvasState.rectangles.forEach((rect: Rectangle) => {
          this.redrawRectangleOnStageRestore(rect);
        });

        break;

      case 'globalPropertiesChanged':
        this.color.setValue(this.canvasState.color);
        this.context.strokeStyle = this.canvasState.color;
        break;

      case 'toolPropertiesChanged':
        const toolState = this.canvasState.toolsState.find(
          (ts) => ts.name === this.selectedTool.name
        );
        this.updateSelectedToolState(toolState!);
        break;
    }
    this.latestOperation = memento.getLatestOperation();
  }
}
