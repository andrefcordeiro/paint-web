import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../users.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  form: FormGroup;

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
      const user = this.form.value;
      await this.userService.createUser(user);
     
    }
  }
}
