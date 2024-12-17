import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../users.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    standalone: false
})
export class SignUpComponent {

  form: FormGroup;

  errorMessage: string;

  constructor(private formBuilder: FormBuilder, 
    private userService: UsersService,
    private router: Router
  ) {}

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
        await this.userService.createUser(user);
        const resp = await this.userService.login(user.username, user.password);

        if (!resp?.accessToken || !resp?.user) {
          this.errorMessage = 'Invalid user information'; 
          return;
        }

        localStorage.setItem('acessToken', resp?.accessToken);
        localStorage.setItem('user', JSON.stringify(resp?.user));
        this.router.navigateByUrl('/profile')
        
      } catch (errRes) {
        const error = (errRes as HttpErrorResponse).error
        this.errorMessage = error.message; 
      }
     
    }
  }
}
