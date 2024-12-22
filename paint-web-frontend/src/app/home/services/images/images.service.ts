import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageFile } from 'src/app/interfaces/image-file.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private httpClient: HttpClient) { }

  uploadImage(image: ImageFile): Promise<any>  {
    let formData: FormData = new FormData();
    formData.append('image', image.imageData);
    
    return this.httpClient.post(environment.apiUrl + '/images', formData).toPromise();
  }
}
