import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagesService } from 'src/app/images/images.service';
import { Image } from 'src/app/interfaces/image.interface';
import { User } from 'src/app/interfaces/user.interface';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router, 
    private imagesService: ImagesService) { }

  user: User;

  images: Image[] | undefined;

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')!);
    if (!this.user) {
      this.router.navigateByUrl('/sign-in')
    }
    // console.log("🚀 ~ ProfileComponent ~ ngOnInit ~ this.user:", this.user)

    this.images = await this.imagesService.getImagesByUser(this.user.id);
    console.log("🚀 ~ ProfileComponent ~ ngOnInit ~ this.images:", this.images)
  }
}
