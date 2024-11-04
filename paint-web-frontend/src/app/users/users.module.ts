import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ProfileComponent,
  ],
})
export class UsersModule { }
