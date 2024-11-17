import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UsersService) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  async onSubmit() {
    if (this.form.valid) {
      const user = this.form.value;
      const res = await this.userService.login(user.username, user.password);
    }
  }
}
