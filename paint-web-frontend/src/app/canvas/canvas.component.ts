import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalToolPropertiesComponent } from './modal-tool-properties/modal-tool-properties.component';
import { ToolProperties } from '../interfaces/tool-properties.interface';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {
  /**
   * Canvas
   */
  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  /**
   * Context
   */
  context: CanvasRenderingContext2D;

  // width = 100;

  // height = 100;

  mouseDown = false;

  tool = 'paintbrush';

  constructor(public dialog: MatDialog) {}

  get canvasElement(): HTMLCanvasElement {
    return this.canvas.nativeElement;
  }

  ngAfterViewInit(): void {
    this.canvasElement.style.width = '100%';
    this.canvasElement.style.height = '100%';

    this.canvasElement.width = this.canvasElement.offsetWidth;
    this.canvasElement.height = this.canvasElement.offsetHeight;

    this.context = this.canvasElement.getContext('2d')!;
    // posibilidades de personalização
    this.context.lineWidth = 5;
    this.context.lineJoin = 'round';
  }

  onMouseDown(event: MouseEvent) {
    this.mouseDown = true;
    this.context.beginPath();
    this.draw(event.clientX, event.clientY);
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

  draw(offsetX: number, offsetY: number) {
    this.context.lineTo(offsetX, offsetY);
    this.context.stroke();
  }

  /**
   * Executed when tool is changed.
   * @param tool Selected tool.
   */
  changeTool(tool: string) {
    this.tool = tool;

    if (tool === 'eraser') {
      this.context.strokeStyle = 'white';
    } else {
      this.context.strokeStyle = '#000000';
    }
  }

  /**
   * Clear all page content
   */
  clearContent(): void {
    this.context.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
  }

  getToolProperties(): ToolProperties {
    return { size: this.context.lineWidth, color: this.context.strokeStyle };
  }

  setContextProperties(toolProperties: ToolProperties) {
    this.context.strokeStyle = toolProperties.color;
    this.context.lineWidth = toolProperties.size;
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    const dialogRef = this.dialog.open(ModalToolPropertiesComponent, {
      data: this.getToolProperties(),
      width: '300px',
      height: '250px',
    });

    dialogRef.afterClosed().subscribe((data: ToolProperties) => {
      if (data) {
        this.setContextProperties(data);
      }
    });
  }
}
