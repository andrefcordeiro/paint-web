import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-save-image',
  templateUrl: './modal-save-image.component.html',
  styleUrls: ['./modal-save-image.component.scss']
})
export class ModalSaveImageComponent {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, 
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      fileName: ['', Validators.required],
    })
  }

  saveImage() {
    const fileName = this.form.get('fileName')?.value;
    console.log("🚀 ~ ModalSaveImageComponent ~ saveImage ~ fileName:", fileName)
  }
}
