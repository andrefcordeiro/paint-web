import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    standalone: false
})
export class OptionsComponent {
  /**
   * Flag that determines whether the help overlay container is open or not.
   */
  helpOverlayOpened = false;

  /**
   * Current url.
   */
  currentUrl = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentUrl = this.router.url;
  }
}
