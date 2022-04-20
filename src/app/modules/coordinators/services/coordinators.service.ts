import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TouchSequence } from 'selenium-webdriver';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorsService {

  private headers = new HttpHeaders(
    { 'Content-Type': 'application/json' }
  );

  constructor(private http: HttpClient) { }

  getCoordinators() {
    return this.http.get(url+'/coordinador/all');
  }

  createCoordinator(data) {
    const option = { headers: this.headers };
    return this.http.post(url+'/coordinador/create', data, option);
  }

  getCoordinatorById(id) {
    const option = { headers: this.headers };
    return this.http.post(url+'/coordinador/getbyid/', id, option);
  }

  editCoordinator(data) {
    const option = { headers: this.headers };
    return this.http.put(url+'/coordinador/edit', data, option);
  }
}

