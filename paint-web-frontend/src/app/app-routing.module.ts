import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ProfileComponent } from './users/profile/profile.component';
import { SignUpComponent } from './users/sign-up/sign-up.component';
import { SignInComponent } from './users/sign-in/sign-in.component';

const routes: Routes = [
  { path: '', component: CanvasComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }