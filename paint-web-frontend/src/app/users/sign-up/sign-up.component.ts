import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../users.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  form: FormGroup;

  errorMessage: string;

  constructor(private formBuilder: FormBuilder, private userService: UsersService) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  async onSubmit() {
    if (this.form.valid) {
      this.errorMessage = '';

      const user = this.form.value;
      try {
        const res = await this.userService.createUser(user);
      } catch (errRes) {
        const error = (errRes as HttpErrorResponse).error
        this.errorMessage = error.message; 
      }
     
    }
  }
}
