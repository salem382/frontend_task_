import { Injectable } from '@angular/core';
import { ApiService } from '../http/api.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { IBook } from '../models/book.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  baseUrl = environment.baseUrl;
  constructor(private Api:ApiService) { }
  
  GetAll(searchTerm: string = '', sortOption: string = ''):Observable<IBook[]> {

    return this.Api.get<IBook[]>(this.baseUrl + `book?title=${searchTerm}&sortBy=${sortOption}`);
  }
  Add(body:IBook):Observable<IBook> {
    return this.Api.post<IBook>(this.baseUrl + 'book', body);
  }
  Update(body:IBook, id:string):Observable<IBook> {
    return this.Api.put<IBook>(this.baseUrl + `book/${id}`, body);
  }
  Delete(id:string):Observable<IBook> {
    return this.Api.delete<IBook>(this.baseUrl + `book/${id}`);
  }
  GetByID(id:string):Observable<IBook> {
    return this.Api.get<IBook>(this.baseUrl + `book/${id}`);
  }
  

}
