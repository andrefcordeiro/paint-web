import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasComponent } from './home/canvas/canvas.component';

const routes: Routes = [
  { path: '', component: CanvasComponent },
  { path: '', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }