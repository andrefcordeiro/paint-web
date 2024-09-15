import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalToolPropertiesComponent } from './modal-tool-properties/modal-tool-properties.component';
import { CanvasTool } from '../../interfaces/canvas-tool.interface';
import { CanvasMemento } from '../../interfaces/canvas-memento';
import { CaretakerService } from '../../services/state-management/caretaker.service';
import { CanvasState } from '../../interfaces/canvas-state';
import { Point } from '../../interfaces/shapes/point.interface';
import { Circle } from './shapes/circle';
import { Rectangle } from './shapes/rectangle';
import { Memento } from '../../services/state-management/memento.interface';
import { Line } from './shapes/line';
import { Shape } from './shapes/shape';
import { ToolButton } from '../../interfaces/tool-button.interface';

/**
 * Types of operations on canvas.
 */
type CanvasOperation = 'drawing';

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
   * Flag that determines whether the left mouse button is being pressed.
   */
  mouseDown = false;

  /**
   * Available tools.
   */
  tools: ToolButton[] = [
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
      name: 'shapes',
      multiTool: true,
      onclickFunction: null,
      options: [
        {
          name: 'circle',
          iconName: 'panorama_fish_eye icon',
          onclickFunction: this.setSelectedTool.bind(this),
        },
        {
          name: 'rect',
          iconName: 'crop_square icon',
          onclickFunction: this.setSelectedTool.bind(this),
        },
      ],
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
  latestOperation: CanvasOperation = 'drawing';

  /**
   * Current shape being drawn on the canvas.
   */
  shape: Shape | null;

  /**
   * The distance between the top-left (0,0) canvas coordinates and the top-left of the viewport.
   */
  panOffSet = { x: 0, y: 0 };

  /**
  * Flag that indicates whether the middle mouse button is being pressed.
  */
  panning = false;

  /**
   * Start position of the panning.
   */
  startPanMousePosition = { x: 0, y: 0 };

  /**
   * Returns the nativeElement of the canvas.
   */
  get canvasElement(): HTMLCanvasElement {
    return this.canvas.nativeElement;
  }

  /**
   *
   * @param dialog Component to render modals.
   * @param caretakerService Service for state management.
   */
  constructor(
    public dialog: MatDialog,
    private caretakerService: CaretakerService
  ) { }

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
    const rect: CanvasTool = { name: 'rect', lineWidth: 5 };

    const toolsState = [paintbrush, eraser, circle, rect];

    this.canvasState = {
      latestOperation: 'drawing',
      color: 'black',
      toolsState: toolsState,
      shapes: [],
      disabled: false,
      selectedTool: paintbrush,
    };
  }

  /**
   * Method called whenever the color input is changed.
   */
  onColorChange(color: string) {
    if (this.canvasState.selectedTool.name !== 'eraser') {
      this.canvasState.color = color;
      this.context.strokeStyle = color;
      this.context.fillStyle = color;
    }
  }

  /**
   * Function to initialize canvas properties.
   */
  private createCanvas() {
    this.canvasElement.width = window.innerWidth;
    this.canvasElement.height = window.innerHeight;

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
      x: x - this.panOffSet.x,
      y: y - this.panOffSet.y
    };
  }

  /**
   * Mouse events.
   */
  onMouseDown(e: MouseEvent) {
    const clientXY = this.getMouseCoordMinusOffset(e.clientX, e.clientY);

    if (e.button === 1) { // middle button
      this.panning = true;
      this.startPanMousePosition = clientXY;
      return;
    }

    if (e.button !== 0 || this.canvasState.disabled) return;

    this.mouseDown = true;

    switch (this.canvasState.selectedTool.name) {
      case 'paintbrush':
      case 'eraser':
        this.shape = new Line(this.context.strokeStyle, this.context.lineWidth);
        if (this.latestOperation === 'drawing') this.saveState(this.latestOperation);
        this.context.beginPath();
        break;

      case 'circle':
      case 'rect':
        if (this.latestOperation === 'drawing') this.saveState(this.latestOperation);
        this.start = clientXY;
        break;
    }
  }

  onMouseUp(e: MouseEvent) {
    if (this.shape) this.canvasState.shapes.push(this.shape);
    this.shape = null;

    this.mouseDown = false;
    this.panning = false;
    this.context.closePath();
  }

  onMouseMove(e: MouseEvent) {
    const clientXY = this.getMouseCoordMinusOffset(e.clientX, e.clientY);

    if (this.panning) {
      const deltaX = clientXY.x - this.startPanMousePosition.x;
      const deltaY = clientXY.y - this.startPanMousePosition.y;
      this.panOffSet = { x: this.panOffSet.x + deltaX, y: this.panOffSet.y + deltaY };

      this.clearContentOnStageRestore();

      this.context.save();
      this.context.translate(this.panOffSet.x, this.panOffSet.y)

      this.redrawContent(this.canvasState.shapes);

      this.context.restore();
      return;
    }

    if (this.mouseDown) {

      switch (this.canvasState.selectedTool.name) {
        case 'paintbrush':
        case 'eraser':
          this.drawLine(clientXY.x, clientXY.y);
          break;

        case 'circle':
          this.shape = new Circle(
            this.canvasState.color,
            this.context.lineWidth,
            { x: clientXY.x, y: clientXY.y },
            this.start
          );
          this.drawShape(this.shape);
          break;

        case 'rect':
          this.shape = new Rectangle(
            this.canvasState.color,
            this.context.lineWidth,
            { x: this.start.x, y: this.start.y },
            { x: clientXY.x - this.start.x, y: clientXY.y - this.start.y }
          );
          this.drawShape(this.shape);
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
        this.undoOperation();
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
  private drawLine(x: number, y: number) {
    this.context.save()
    this.context.translate(this.panOffSet.x, this.panOffSet.y)
    this.context.lineTo(x, y);
    this.context.stroke();
    (this.shape as Line).pushPoint({ x, y });
    this.context.restore()
  }

  /**
   * Draw shape on the canvas.
   * @param shape Shape.
   */
  private drawShape(shape: Shape) {
    // clearing and redrawing content before a new circle is drawn
    this.clearContentOnStageRestore();

    this.context.save()
    this.context.translate(this.panOffSet.x, this.panOffSet.y)

    this.redrawContent(this.canvasState.shapes);

    shape.draw(this.context);
    this.context.restore()
  }

  /**
   * Clear all page content before redrawing content on state restore.
   */
  private clearContentOnStageRestore() {
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
    const rect: Rectangle = new Rectangle(
      'white',
      0,
      { x: 0, y: 0 },
      { x: this.canvasElement.width, y: this.canvasElement.height }
    );
    this.context.clearRect(rect.x1, rect.y1, rect.x2, rect.y2);

    // removing stored shapes
    this.canvasState.shapes = [];
    this.canvasState.shapes.push(rect);
  }

  /**
   * Executed when tool is changed.
   * @param tool Selected tool.
   */
  private setSelectedTool(name: string) {
    const selectedToolState: CanvasTool | undefined =
      this.canvasState.toolsState.find((tState) => tState.name === name);

    if (selectedToolState) {
      this.canvasState.selectedTool = selectedToolState;
      this.setToolPropertiesContext();
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
    this.canvasState.selectedTool = tool;
    this.setToolPropertiesContext();
  }

  /**
   * Set the properties of the selected tool in the canvas context.
   */
  private setToolPropertiesContext() {
    if (this.canvasState.selectedTool.name === 'eraser') {
      this.context.strokeStyle = this.backgroundColor;
    }
    if (
      ['paintbrush', 'circle', 'rect'].includes(
        this.canvasState.selectedTool.name
      )
    ) {
      this.context.strokeStyle = this.canvasState.color;
    }
    this.context.lineWidth = this.canvasState.selectedTool.lineWidth;
    this.context.lineJoin = 'round';
  }

  /**
   * Function called when the user right click on the canvas.
   * @param e Mouse event.
   */
  onRightClick(e: MouseEvent) {
    e.preventDefault();
    const dialogRef = this.dialog.open(ModalToolPropertiesComponent, {
      data: this.canvasState.selectedTool,
      width: '300px',
      height: '250px',
    });

    dialogRef.afterClosed().subscribe((data: CanvasTool) => {
      if (data) {
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
    this.latestOperation = currentOperation as CanvasOperation;
  }

  /**
   * Method executed when user press ctrl+z to undo the current operation.
   */
  private undoOperation() {
    const currentState = this.createMementoFromState(this.latestOperation);
    const memento = this.caretakerService.popMemento(currentState) as CanvasMemento;

    if (memento) this.restoreState(memento);
  }

  /**
   * Method executed when user press ctrl+shift+z to redo the latest operation.
   */
  private redoOperation() {
    const currentState = this.createMementoFromState(this.latestOperation);
    const memento = this.caretakerService.restoreDeletedMemento(currentState);

    if (!memento) return;

    this.restoreState(memento);
  }

  /**
   * Restores the canvas state stored in the memento.
   */
  private restoreState(memento: Memento) {
    const selectedTool = this.canvasState.selectedTool;
    this.canvasState = memento.getState();
    // do not change selected tool with ctrl+z
    if (this.canvasState.selectedTool.name !== selectedTool.name)
      this.canvasState.selectedTool = selectedTool;

    switch (this.latestOperation) {
      case 'drawing':
        this.redrawContent(this.canvasState.shapes);
        break;

    }
    this.latestOperation = memento.getLatestOperation() as CanvasOperation;
  }

  /**
   * Method to redraw all the content
   * @param shapes
   */
  private redrawContent(shapes: Shape[]) {
    this.clearContentOnStageRestore();

    shapes.forEach((shape) => {
      let sInstance;

      switch (shape.type) {
        case 'line':
          const l = <Line>shape;
          sInstance = new Line(shape.color, shape.lineWidth, l.points);
          break;

        case 'circ':
          const c = <Circle>shape;
          sInstance = Circle.createFromAnotherInstance(c);
          break;

        case 'rect':
          const r = <Rectangle>shape;
          sInstance = new Rectangle(
            shape.color,
            shape.lineWidth,
            { x: r.x1, y: r.y1 },
            { x: r.x2, y: r.y2 }
          );
          break;
      }

      if (sInstance) sInstance.draw(this.context);
    });
  }

  /**
   * Method to handle the mouse wheel event to control canvas zoom.
   * @param e Mouse event.
  */
  // @HostListener('window:wheel', ['$event'])
  // private onMouseWheel(e: any) {
  //   console.log("🚀 ~ CanvasComponent ~ onMouseWheel ~ e.deltaY:", e.deltaY)
  //   if (e.deltaY > 0) {
  //     this.zoomInfo.scale -= this.zoomInfo.SCROLL_SENSITIVITY;
  //   } else {
  //     this.zoomInfo.scale += this.zoomInfo.SCROLL_SENSITIVITY;
  //   }

  //   this.zoomInfo.scale = Math.min(this.zoomInfo.scale, this.zoomInfo.MAX_ZOOM)
  //   this.zoomInfo.scale = Math.max(this.zoomInfo.scale, this.zoomInfo.MIN_ZOOM)
  //   console.log("🚀 ~ CanvasComponent ~ onMouseWheel ~ this.zoomInfo.scale:", this.zoomInfo.scale)

  //   this.context.save();

  //   this.clearContentOnStageRestore();

  //   // PARA DAR ZOOM NO MEIO DA TELA
  //   // const scaleWidth = this.canvasElement.width * this.zoomInfo.scale;
  //   // const scaleHeight = this.canvasElement.height * this.zoomInfo.scale;

  //   // const scaleOffSetX = (scaleWidth - this.canvasElement.width) / 2;
  //   // const scaleOffSetY = (scaleHeight - this.canvasElement.height) / 2;
  //   // this.zoomInfo.scaleOffSet = {x: scaleOffSetX, y: scaleOffSetY};

  //   // this.context.translate(this.mousePosition.x * this.zoomInfo.scale, this.mousePosition.y * this.zoomInfo.scale);

  //   this.context.scale(this.zoomInfo.scale, this.zoomInfo.scale);

  //   const currentShapes = this.canvasState.shapes;

  //   this.redrawContent(currentShapes);

  //   this.context.restore();
  // }
}
