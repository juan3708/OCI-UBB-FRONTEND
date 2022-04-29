import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  private headers = new HttpHeaders(
    { 'Content-Type': 'application/json' }
  );

  constructor(private http: HttpClient) { }

  getLessons() {
    return this.http.get(url+'/clase/all');
  }

  createLesson(data) {
    const option = { headers: this.headers };
    return this.http.post(url+'/clase/create', data, option);
  }

  getLessonById(id) {
    const option = { headers: this.headers };
    return this.http.post(url+'/clase/getbyid/', id, option);
  }

  editLesson(data) {
    const option = { headers: this.headers };
    return this.http.put(url+'/clase/edit', data, option);
  }

  deleteLesson(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/clase/delete',id,option);
  }

  getCycles(){
    return this.http.get(url +'/ciclo/all');
  }

  getLevelById(id){
    const option = { headers: this.headers };
    return this.http.post(url +'/nivel/getbyid', id, option);
  }
}
