import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SharedModule } from '../shared/shared.module';
import { UsersService } from './users.service';
import { HttpClientModule } from '@angular/common/http';
import { SignInComponent } from './sign-in/sign-in.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  imports: [
    SharedModule,
    HttpClientModule,
    UsersRoutingModule
  ],
  declarations: [
    ProfileComponent,
    SignUpComponent,
    SignInComponent,
  ],
  providers: [
    UsersService
  ]
})
export class UsersModule { }
