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
  data: CanvasTool;

  /**
   * Form with the properties values.
   */
  public propertiesForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalToolPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: CanvasTool
  ) {
    this.data = dialogData;

    this.propertiesForm = new FormGroup({
      size: new FormControl(this.data.size),
      color: new FormControl(this.data.color),
    });
  }

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close({
        name: this.data.name,
        size: this.propertiesForm.value.size,
        color: this.propertiesForm.value.color,
      });
    });
  }
}
