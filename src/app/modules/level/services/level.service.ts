import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  constructor(private http: HttpClient) {
  }

  private headers = new HttpHeaders(
    { 'Content-Type': 'application/json' }
  );

  getLevels() {
    return this.http.get(url + '/nivel/all');
  }

  createLevel(data) {
    const option = { headers: this.headers };
    return this.http.post(url + '/nivel/create', data, option);
  }

  getLevelById(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/nivel/getbyid/', id, option);
  }

  editLevel(data) {
    const option = { headers: this.headers };
    return this.http.put(url + '/nivel/edit', data, option);
  }

  deleteLevel(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/nivel/delete', id, option);
  }

  levelassociate(data) {
    const option = { headers: this.headers };
    return this.http.post(url + '/nivel/levelassociate', data, option);
  }

  deleteStudent(data) {
    const option = { headers: this.headers };
    return this.http.post(url + '/nivel/deletestudent', data, option);
  }

}
