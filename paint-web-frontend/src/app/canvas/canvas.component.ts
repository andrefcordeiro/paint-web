import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalToolPropertiesComponent } from './modal-tool-properties/modal-tool-properties.component';
import { CanvasTool } from '../interfaces/canvas-tool.interface';

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
      iconName: 'clear icon',
      onclickFunction: this.clearContent.bind(this),
    },
    {
      name: 'save-canvas',
      iconName: 'save',
      onclickFunction: this.downloadImage.bind(this),
    },
  ];

  /**
   * Selected tool.
   */
  selectedTool: CanvasTool = { name: 'paintbrush', size: 5, color: '#000000' };

  /**
   * State of each avaliable tool.
   */
  toolsState: CanvasTool[] = [
    { name: 'paintbrush', size: 5, color: '#000000' },
    { name: 'eraser', size: 5, color: 'white' },
  ];

  /**
   * Return the nativeElement of the canvas.
   */
  get canvasElement(): HTMLCanvasElement {
    return this.canvas.nativeElement;
  }

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.createCanvas();
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
    this.setContextProperties();
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
      this.setContextProperties();
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
    this.setContextProperties();
  }

  /**
   * Set the properties of the selected tool in the canvas context.
   */
  setContextProperties() {
    this.context.strokeStyle = this.selectedTool.color;
    this.context.lineWidth = this.selectedTool.size;
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
