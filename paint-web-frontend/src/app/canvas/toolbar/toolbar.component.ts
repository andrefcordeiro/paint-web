import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CanvasState } from 'src/app/interfaces/canvas-state';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Input() tools: any[];

  @Input() canvasState: CanvasState;

  @Output() colorChange = new EventEmitter<string>();

  onColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.colorChange.emit(input.value);
  }
}
