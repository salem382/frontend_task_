import { Injectable } from '@angular/core';
import { ApiService } from '../http/api.service';
import { Iuser } from '../models/user.model';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private Api:ApiService) { }
  login(body: Iuser):Observable<{token: string}> {
     const headers = new HttpHeaders({
      'x-api-key': 'reqres-free-v1',
      'Content-Type': 'application/json'
    });
    return this.Api.post<{token: string}>('https://reqres.in/api/login', body, headers);
  }
}
