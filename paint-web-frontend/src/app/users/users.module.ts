import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SharedModule } from '../shared/shared.module';
import { UsersService } from './users.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    SharedModule,
    HttpClientModule
  ],
  declarations: [
    ProfileComponent,
    SignUpComponent,
  ],
  providers: [
    UsersService
  ]
})
export class UsersModule { }
