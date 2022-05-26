import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  private headers = new HttpHeaders(
    { 'Content-Type': 'application/json' }
  );

  constructor(private http: HttpClient) { }

  getTeachers() {
    return this.http.get(url+'/profesor/all');
  }

  createTeacher(data) {
    const option = { headers: this.headers };
    return this.http.post(url+'/profesor/create', data, option);
  }

  getTeacherById(id) {
    const option = { headers: this.headers };
    return this.http.post(url+'/profesor/getbyid/', id, option);
  }

  editTeacher(data) {
    const option = { headers: this.headers };
    return this.http.put(url+'/profesor/edit', data, option);
  }

  deleteTeacher(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/profesor/delete',id,option);
  }

  getTeachersPerCycle(id){
    const option = { headers: this.headers };
    return this.http.post(url + '/ciclo/getteacherspercycle',id,option);
  }
}
