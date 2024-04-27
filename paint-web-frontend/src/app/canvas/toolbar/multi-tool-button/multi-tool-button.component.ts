import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-multi-tool-button',
  templateUrl: './multi-tool-button.component.html',
  styleUrls: ['./multi-tool-button.component.scss'],
})
export class MultiToolButtonComponent implements OnInit {
  @Input() tool: any;

  public selectedOption: any;

  isOpen = false;

  ngOnInit() {
    this.selectedOption = this.tool.options[0];
  }

  openOptionsList(event: any) {
    event.preventDefault();
    this.isOpen = !this.isOpen;
  }
}
