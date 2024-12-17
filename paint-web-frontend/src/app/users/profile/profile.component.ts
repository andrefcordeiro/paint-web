import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router) { }

  user: User

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    if (!this.user) {
      this.router.navigateByUrl('/sign-in')
    }
  }
}
