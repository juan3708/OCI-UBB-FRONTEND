import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private headers = new HttpHeaders(
    { 'Content-Type': 'application/json' }
  );
  
  constructor(private http: HttpClient) { }

  getNews() {
    return this.http.get(url + '/noticia/all');
  }
}
