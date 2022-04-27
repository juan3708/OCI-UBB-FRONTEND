import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssistantsService {

  private headers = new HttpHeaders(
    { 'Content-Type': 'application/json' }
  );

  constructor(private http: HttpClient) { }

  getAssistants() {
    return this.http.get(url+'/ayudante/all');
  }

  createAssistant(data) {
    const option = { headers: this.headers };
    return this.http.post(url+'/ayudante/create', data, option);
  }

  getAssistantById(id) {
    const option = { headers: this.headers };
    return this.http.post(url+'/ayudante/getbyid/', id, option);
  }

  editAssistant(data) {
    const option = { headers: this.headers };
    return this.http.put(url+'/ayudante/edit', data, option);
  }

  deleteAssistant(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/ayudante/delete',id,option);
  }
}
