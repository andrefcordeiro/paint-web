import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    standalone: false
})
export class SignInComponent {
  
  form: FormGroup;

  errorMessage: string;

  passwordErrorMessage: string;

  private subscriptions = new Subscription();

  get password() {
    return this.form.get('password');
  }

  constructor(private formBuilder: FormBuilder, 
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })

    this.subscriptions.add(this.form.valueChanges.subscribe(() => {
      if (this.password?.errors) {
        this.passwordErrorMessage = 'Password must be at least 8 characters long.'
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  async onSubmit() {
    if (this.form.valid) {
      this.errorMessage = '';

      const user = this.form.value;
      try {
        const res = await this.userService.login(user.username, user.password);
      } catch (errRes) {
        const error = (errRes as HttpErrorResponse).error
        this.errorMessage = error.message; 
      }
    }
  }

  navigateToSignUpPage() {
    this.router.navigateByUrl('/sign-up')
  }
}
