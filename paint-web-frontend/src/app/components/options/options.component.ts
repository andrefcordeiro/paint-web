import { Component } from '@angular/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {
  
  user = null;

  /**
   * Flag that determines whether the help overlay container is open or not.
   */
  helpOverlayOpened = false;
}
