import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CanvasState } from 'src/app/interfaces/canvas-state';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToolButton } from 'src/app/interfaces/tool-button.interface';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  /**
   * Available tools.
   */
  @Input() tools: ToolButton[];

  /**
   * State of the canvas.
   */
  @Input() canvasState: CanvasState;

  /**
   * Event to change canvas color.
   */
  @Output() colorChange = new EventEmitter<string>();

  /**
   * Method executed when the event for changing canvas color is fired.
   * @param event Event.
   */
  onColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.colorChange.emit(input.value);
  }

  /**
   * Method executed when drop event is fired.
   * @param event Drop event.
   */
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tools, event.previousIndex, event.currentIndex);
  }
}
