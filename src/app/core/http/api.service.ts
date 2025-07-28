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

  get<T>(url: string, params?: any, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${url}`, { params, headers });
  }

  post<T>(url: string, data: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${url}`, data, { headers });
  }

  put<T>(url: string, data: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${url}`, data, { headers });
  }

  delete<T>(url: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${url}`, { headers });
  }
}
