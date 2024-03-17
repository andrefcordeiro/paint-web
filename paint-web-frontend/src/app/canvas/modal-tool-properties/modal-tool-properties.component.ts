import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CanvasTool } from 'src/app/interfaces/canvas-tool.interface';

@Component({
  selector: 'app-modal-tool-properties',
  templateUrl: './modal-tool-properties.component.html',
  styleUrls: ['./modal-tool-properties.component.scss'],
})
export class ModalToolPropertiesComponent {
  /**
   * Data passed to the modal.
   */
  toolData: CanvasTool;

  /**
   * Form with the properties values.
   */
  public propertiesForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalToolPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: CanvasTool
  ) {
    this.toolData = dialogData;

    this.propertiesForm = new FormGroup({
      lineWidth: new FormControl(this.toolData.lineWidth),
    });
  }

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close({
        name: this.toolData.name,
        lineWidth: this.propertiesForm.value.lineWidth,
      });
    });
  }
}
