import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) { }

  createUser(user: User) {
    return this.httpClient.post(environment.apiUrl + '/auth/register', user).toPromise();
  }

  login(username: string, password: string): Promise<{ accessToken: string, user: User } | undefined> {
    return this.httpClient.post<{ accessToken: string, user: User } | undefined>(environment.apiUrl + '/auth/login', { username, password }).toPromise();
  }
}
