import { Component, Input, OnInit } from '@angular/core';
import { ToolButton } from 'src/app/interfaces/tool-button.interface';

@Component({
    selector: 'app-multi-tool-button',
    templateUrl: './multi-tool-button.component.html',
    styleUrls: [
        './multi-tool-button.component.scss',
        '../toolbar.component.scss',
    ],
    standalone: false
})
export class MultiToolButtonComponent implements OnInit {
  /**
   * ToolButton to be displayed.
   */
  @Input() tool: ToolButton;

  /**
   * Selected button option.
   */
  selectedOption: ToolButton | null;

  /**
   * Flag that determines whether the button options should be displayed or not.
   */
  isOpen = false;

  ngOnInit() {
    this.selectedOption = this.tool.options ? this.tool.options[0] : null;
  }

  /**
   * Method to toggle the value to show the button options list.
   * @param event Event.
   */
  openOptionsList(event: any) {
    event.preventDefault();
    this.isOpen = !this.isOpen;
  }
}
