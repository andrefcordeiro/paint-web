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
      size: new FormControl(this.toolData.size),
      color: new FormControl(this.toolData.color),
    });
  }

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close({
        name: this.toolData.name,
        size: this.propertiesForm.value.size,
        color: this.propertiesForm.value.color
          ? this.propertiesForm.value.color
          : this.toolData.color,
      });
    });
  }

  /**
   * Function to determine if the color input should be displayed.
   * @returns Boolean
   */
  shouldDisplayColorInput() {
    const toolsNames = ['paintbrush'];
    return toolsNames.includes(this.toolData.name);
  }
}
