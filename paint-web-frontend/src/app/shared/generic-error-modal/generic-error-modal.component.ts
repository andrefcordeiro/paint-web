import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-generic-error-modal',
  templateUrl: './generic-error-modal.component.html',
  styleUrl: './generic-error-modal.component.scss',
  standalone: false
})
export class GenericErrorModalComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public errorMessage: string,
  ) {
  }
}
