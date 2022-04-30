import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {


    private headers = new HttpHeaders(
    { 'Content-Type': 'application/json' });


  constructor(private http: HttpClient) { }

  getActivities() {
    return this.http.get(url + '/actividad/all');
  }

  createActivity(data) {
    const option = { headers: this.headers };
    return this.http.post(url + '/actividad/create', data, option);
  }

  getActivityById(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/actividad/getbyid/', id, option);
  }

  editActivity(data) {
    const option = { headers: this.headers };
    return this.http.put(url + '/actividad/edit', data, option);
  }

  deleteActivity(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/actividad/delete', id, option);
  }
}

