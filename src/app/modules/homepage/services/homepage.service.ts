import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  private headers = new HttpHeaders(
    { 'Content-Type': 'application/json' }
  );

  constructor(private http: HttpClient) { }

  getNews() {
    return this.http.get(url + '/noticia/all');
  }

  getRecentPost() {
    return this.http.get(url + '/noticia/recentpost');
  }

  getNewsLikeWord(data) {
    const option = {headers:this.headers};
    return this.http.post(url+'/noticia/getbyword', data, option);
  }

  sendContactEmails(data){
    const option = { headers: this.headers };
    return this.http.post(url +'/mail/contact', data, option);
  }
}
