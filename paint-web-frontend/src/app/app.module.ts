import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UsersModule } from './users/users.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HomeModule } from './home/home.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HomeModule,
    UsersModule,
    AppRoutingModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
