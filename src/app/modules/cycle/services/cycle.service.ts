import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CycleService {

  private headers = new HttpHeaders(
    { 'Content-Type': 'application/json' }
  );

  constructor(private http: HttpClient) { }

  getCycles(){
    return this.http.get(url +'/ciclo/all');
  }

  getCoordinators(){
    return this.http.get(url +'/coordinador/all');
  }

  createCycle(data){
    const option = { headers: this.headers };
    return this.http.post(url+'/ciclo/create', data, option);
  }

  deleteCycle(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/ciclo/delete',id,option);
  }

  getCycleById(id) {
    const option = { headers: this.headers };
    return this.http.post(url+'/ciclo/getbyid/', id, option);
  }

  editCycle(data) {
    const option = { headers: this.headers };
    return this.http.put(url+'/ciclo/edit', data, option);
  }
}
