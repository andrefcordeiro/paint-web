import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagesService } from '../../../images/images.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageUpload } from 'src/app/interfaces/image-upload.interface';
import { GenericErrorModalComponent } from 'src/app/shared/generic-error-modal/generic-error-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-modal-save-image',
    templateUrl: './modal-save-image.component.html',
    styleUrls: ['./modal-save-image.component.scss'],
    standalone: false
})
export class ModalSaveImageComponent {

  form: FormGroup;

  image: ImageUpload;

  constructor(private formBuilder: FormBuilder, 
    private imagesService: ImagesService,
    private dialogRef: MatDialogRef<ModalSaveImageComponent>,
    @Inject(MAT_DIALOG_DATA) public imageData: Blob,
    public dialog: MatDialog,
  ) {
    this.image = { fileName: '', imageData };
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      fileName: ['a', Validators.required],
    })
  }

  async saveImage() {
    this.image.fileName = this.form.get('fileName')?.value;

    try {
      await this.imagesService.uploadImage(this.image);
    } catch (errRes) {
       const error = (errRes as HttpErrorResponse).error;

        this.dialog.open(GenericErrorModalComponent, {
          data: error.message,
          width: '500px',
          height: '250px',
        })
    }
    this.dialogRef.close();
  }
}
