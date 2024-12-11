import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageFile } from 'src/app/interfaces/image-file.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private httpClient: HttpClient) { }

  uploadImage(image: ImageFile) {
    console.log("🚀 ~ ImagesService ~ uploadImage ~ image:", image)
    // return this.httpClient.post(environment.apiUrl + '/auth/register', user).toPromise();
  }
}
