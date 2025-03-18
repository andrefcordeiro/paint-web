import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagesService } from 'src/app/images/images.service';
import { Image } from 'src/app/interfaces/image.interface';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from '../users.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router, 
    private imagesService: ImagesService,
    private usersService: UsersService) { }

  user: User;

  images: Image[] | undefined;

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')!);
    if (!this.user) {
      this.router.navigateByUrl('/sign-in')
    } else {
      this.images = await this.imagesService.getImagesByUser(this.user.id);
    }
  }

  logout() {
    this.usersService.logout();
    window.location.reload();
  }

  async deleteImage(imageId: string) {
    await this.imagesService.deleteImage(imageId);
    this.images = await this.imagesService.getImagesByUser(this.user.id);
  }

  /**
   * Function called to download the canvas content as an image.
   */
  async downloadImage(imageUrl: string) {
    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank'; // Open in a new tab if needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
