import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router) { }

  // user = false;
  user = {
    name: "John Doe",
    username: "johndoe",
    email: "jhondoe@gmail.com",
    createdAt: "01/01/2001"
  }

  ngOnInit(): void {
    if (!this.user) {
      this.router.navigateByUrl('/sign-in')
    }
  }
}
