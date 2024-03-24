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
   * Latest bezierCurveCircle drawn
   */
  bezierCurveCircle: BezierCurveCircle;

  /**
   * Current line being drawn on the canvas.
   */
  line: Line = { points: [], color: '' };

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
        this.saveState('drawing');
        this.context.beginPath();
        this.draw(p.x, p.y);
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
        this.canvasState.lines.push(this.line);
        this.line = { points: [], color: '' };
        break;

      case 'circle':
        this.canvasState.circles.push(this.bezierCurveCircle);
        this.bezierCurveCircle = {} as BezierCurveCircle;
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

    if (e.ctrlKey && key === 'z') {
      this.restoreState();
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
    this.context.strokeStyle = line.color;
    this.context.beginPath();

    line.points.forEach((p) => {
      this.context.lineTo(p.x, p.y);
    });

    this.context.stroke();
    this.context.closePath();
    this.context.strokeStyle = this.color.value;
  }

  /**
   * Draw circle on the canvas.
   * @param x X coordinate.
   * @param y Y coordinate.
   */
  private async drawCircle(x: number, y: number) {
    // restoring canvas state everytime a new circle is drawn
    this.restoreState();
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
    this.context.strokeStyle = circle.color;
    this.context.beginPath();

    this.context.moveTo(circle.start.x, circle.start.y);

    this.drawBezierCurveTo(circle.topBezierCurve);
    this.drawBezierCurveTo(circle.bottomBezierCurve);

    this.context.stroke();
    this.context.closePath();

    this.context.strokeStyle = this.color.value;
  }

  /**
   * Clear all page content.
   */
  clearContent() {
    this.context.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
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
   * Saves the current state inside a memento.
   */
  private saveState(latestOperation: string) {
    this.canvasState.latestOperation = latestOperation;
    const memento = new CanvasMemento(
      JSON.parse(JSON.stringify(this.canvasState))
    );
    this.caretakerService.pushMemento(memento);
  }

  /**
   * Restores the Originator's state from a memento object.
   */
  private restoreState() {
    const memento = this.caretakerService.popMemento() as CanvasMemento;
    if (!memento) return;

    this.canvasState = memento.getState();

    switch (this.canvasState.latestOperation) {
      case 'drawing':
        this.clearContent();
        // redrawing content
        this.canvasState.circles.forEach((circle: BezierCurveCircle) => {
          this.redrawCircleOnStageRestore(circle);
        });

        this.canvasState.lines.forEach((line: Line) => {
          this.redrawLineOnStageRestore(line);
        });

        break;

      case 'globalPropertiesChanged':
        this.color.setValue(this.canvasState.color);
        this.context.strokeStyle = this.canvasState.color;
        break;
    }
  }
}
