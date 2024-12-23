import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageUpload } from 'src/app/interfaces/image-upload.interface';
import { environment } from 'src/environments/environment';
import { Image } from '../interfaces/image.interface';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private httpClient: HttpClient) { }

  uploadImage(image: ImageUpload): Promise<any>  {
    let formData: FormData = new FormData();
    formData.append('image', image.imageData, `${image.fileName}.png`);
    
    return this.httpClient.post(environment.apiUrl + '/images', formData).toPromise();
  }

  getImagesByUser(userId: string) {
    return this.httpClient.get<Image[]>(environment.apiUrl + `/images?user-id=${userId}`).toPromise();
  }

  deleteImage(imageId: string) {
    return this.httpClient.delete<Image[]>(environment.apiUrl + `/images/${imageId}`).toPromise();
  }
}
