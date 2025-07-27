import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseURL = environment.baseUrl;

  constructor(private http: HttpClient) {}

  get<T>(url: any, params?: any): Observable<T> {
    return this.http.get<T>(`${this.baseURL}/${url}`, { params });
  }

  post<T>(url: any, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseURL}/${url}`, data);
  }

  put<T>(url: any, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseURL}/${url}`, data);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseURL}/${url}`);
  }

}
