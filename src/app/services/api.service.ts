import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getUrl<T>(url: string, headers?: HttpHeaders): Observable<HttpResponse<T>> {
    return this.http.get<T>(url, {headers: headers, observe: 'response'});
  }

  // ... funcs for all addtl REST methods (POST, PUT, DELETE, PATCH etc)
}
