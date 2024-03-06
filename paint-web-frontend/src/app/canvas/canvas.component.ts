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

  mouseDown = false;

  /**
   * Selected tool.
   */
  tool: CanvasTool = { name: 'paintbrush', size: 5, color: '#000000' };

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
    this.setContextProperties(this.tool);
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

    this.changeTool(keysTools[key]);
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
   * Executed when tool is changed.
   * @param tool Selected tool.
   */
  changeTool(tool: string) {
    if (tool === 'eraser') {
      this.tool.color = 'white';
      this.tool.name = 'eraser';
    } else if (tool === 'paintbrush') {
      this.tool.color = '#000';
      this.tool.name = 'paintbrush';
    }
    this.setContextProperties(this.tool);
  }

  /**
   * Clear all page content
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
   * Set the properties of the selected tool in the canvas context.
   * @param canvasTool Tool's properties.
   */
  setContextProperties(canvasTool: CanvasTool) {
    this.context.strokeStyle = canvasTool.color;
    this.context.lineWidth = canvasTool.size;
    this.context.lineJoin = 'round';

    this.tool = canvasTool;
  }

  /**
   * Function called when the user right click on the canvas.
   * @param event Mouse event.
   */
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    const dialogRef = this.dialog.open(ModalToolPropertiesComponent, {
      data: this.tool,
      width: '300px',
      height: '250px',
    });

    dialogRef.afterClosed().subscribe((data: CanvasTool) => {
      if (data) {
        this.setContextProperties(data);
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
