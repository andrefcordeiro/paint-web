import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalToolPropertiesComponent } from './modal-tool-properties/modal-tool-properties.component';
import { CanvasTool } from '../interfaces/canvas-tool.interface';
import { FormControl, FormGroup } from '@angular/forms';

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
   * State of each avaliable tool.
   */
  toolsState: CanvasTool[] = [];

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

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.initializeToolsState();
    this.initializeGlobalPropertiesForm();
  }

  ngAfterViewInit() {
    this.createCanvas();
  }

  /**
   * Initialize global properties.
   */
  private initializeGlobalPropertiesForm() {
    this.globalPropertiesForm = new FormGroup({
      color: new FormControl('black'),
    });
    this.globalPropertiesForm.valueChanges.subscribe((value) => {
      this.setGlobalPropertiesContext(value);
    });
  }

  /**
   * Set new context properties values.
   * @param newValues New context properties values.
   */
  private setGlobalPropertiesContext(newValues: any) {
    if (this.selectedTool.name !== 'eraser')
      this.context.strokeStyle = newValues?.color;
  }

  /**
   * Initialize the state of the canvas tools.
   */
  private initializeToolsState() {
    const paintbrush: CanvasTool = {
      name: 'paintbrush',
      lineWidth: 5,
    };
    const eraser: CanvasTool = {
      name: 'eraser',
      lineWidth: 5,
    };

    this.selectedTool = paintbrush;
    this.toolsState.push(paintbrush, eraser);
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
   * Mouse events.
   */
  onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      this.mouseDown = true;
      this.context.beginPath();
      this.draw(event.clientX, event.clientY);
    }
  }

  onMouseUp(event: MouseEvent) {
    this.mouseDown = false;
    this.context.closePath();
  }

  onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      this.draw(event.clientX, event.clientY);
    }
  }

  onMouseOut() {
    this.mouseDown = false;
  }

  /**
   * Function to handle keyboard event and change selected tool.
   * @param event Keyboard event.
   */
  @HostListener('document:keyup', ['$event'])
  private handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    const keysTools: { [key: string]: string } = {
      e: 'eraser',
      b: 'paintbrush',
    };

    this.setSelectedTool(keysTools[key]);
  }

  /**
   * Function to draw on the canvas.
   * @param x X coordinate.
   * @param y Y coordinate.
   */
  private draw(x: number, y: number) {
    this.context.lineTo(
      x - this.canvasElement.offsetLeft,
      y - this.canvasElement.offsetTop
    );
    this.context.stroke();
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
    const selectedToolState: CanvasTool | undefined = this.toolsState.find(
      (tState) => tState.name === name
    );

    if (selectedToolState) {
      this.selectedTool = selectedToolState;
      this.setToolPropertiesContext();
    }
  }

  /**
   * Update the stored state of the selected tool.
   * @param tool Selected tool.
   */
  private updateSelectedToolState(tool: CanvasTool) {
    const indexToolState = this.toolsState.findIndex(
      (tState) => tState.name === tool.name
    );

    this.toolsState[indexToolState] = tool;
    this.selectedTool = tool;
    this.setToolPropertiesContext();
  }

  /**
   * Set the properties of the selected tool in the canvas context.
   */
  setToolPropertiesContext() {
    if (this.selectedTool.name === 'eraser') {
      this.context.strokeStyle = this.backgroundColor;
    }
    if (this.selectedTool.name === 'paintbrush') {
      this.context.strokeStyle = this.color.value;
    }
    this.context.lineWidth = this.selectedTool.lineWidth;
    this.context.lineJoin = 'round';
  }

  /**
   * Function called when the user right click on the canvas.
   * @param event Mouse event.
   */
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    const dialogRef = this.dialog.open(ModalToolPropertiesComponent, {
      data: this.selectedTool,
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
}
