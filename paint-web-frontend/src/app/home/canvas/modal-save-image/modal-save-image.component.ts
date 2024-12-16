import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagesService } from '../../services/images/images.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageFile } from 'src/app/interfaces/image-file.interface';

@Component({
    selector: 'app-modal-save-image',
    templateUrl: './modal-save-image.component.html',
    styleUrls: ['./modal-save-image.component.scss'],
    standalone: false
})
export class ModalSaveImageComponent {

  form: FormGroup;

  image: ImageFile;

  constructor(private formBuilder: FormBuilder, 
    private imagesService: ImagesService,
    private dialogRef: MatDialogRef<ModalSaveImageComponent>,
    @Inject(MAT_DIALOG_DATA) public imageData: string
  ) {
    this.image = { fileName: '', imageData };
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      fileName: ['a', Validators.required],
    })
  }

  saveImage() {
    this.image.fileName = this.form.get('fileName')?.value;

    this.imagesService.uploadImage(this.image);
    // this.dialogRef.close();
  }
}
