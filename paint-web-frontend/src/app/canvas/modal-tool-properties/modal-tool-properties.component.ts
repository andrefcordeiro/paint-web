import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToolProperties } from 'src/app/interfaces/tool-properties.interface';

@Component({
  selector: 'app-modal-tool-properties',
  templateUrl: './modal-tool-properties.component.html',
  styleUrls: ['./modal-tool-properties.component.scss'],
})
export class ModalToolPropertiesComponent {
  public propertiesForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalToolPropertiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ToolProperties
  ) {
    this.propertiesForm = new FormGroup({
      size: new FormControl(data.size),
      color: new FormControl(data.color),
    });

    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close({
        size: this.propertiesForm.value.size,
        color: this.propertiesForm.value.color,
      });
    });
  }
}
