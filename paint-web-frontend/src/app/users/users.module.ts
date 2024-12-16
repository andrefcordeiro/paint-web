import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SharedModule } from '../shared/shared.module';
import { UsersService } from './users.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SignInComponent } from './sign-in/sign-in.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({ declarations: [
        ProfileComponent,
        SignUpComponent,
        SignInComponent,
    ], imports: [SharedModule,
        UsersRoutingModule], providers: [
        UsersService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class UsersModule { }
