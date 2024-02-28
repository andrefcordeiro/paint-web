import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

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

  mode = 'paintbrush';

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
      if (this.mode === 'paintbrush') {
        this.draw(event.clientX, event.clientY);
      } else if (this.mode === 'eraser') {
        this.erase(event.clientX, event.clientY);
      }
    }
  }

  onMouseOut(event: MouseEvent) {
    this.mouseDown = false;
  }

  draw(offsetX: number, offsetY: number) {
    this.context.lineTo(offsetX, offsetY);
    this.context.stroke();
  }

  erase(offsetX: number, offsetY: number) {
    this.context.lineTo(offsetX, offsetY);
    this.context.stroke();
  }

  changeMode(mode: string) {
    this.mode = mode;

    if (mode === 'eraser') {
      this.context.strokeStyle = 'white';
    } else {
      this.context.strokeStyle = 'black';
    }
  }

  clearContent() {
    this.context.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
  }

  onRightClick(event: Event) {
    event.preventDefault();
    this.context.lineWidth += 10;
    console.log('Right click');
  }
}
