import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CostsService {

  private headers = new HttpHeaders(
    {  'Content-Type':  'application/json' }
  );

  constructor(private http: HttpClient) { }

  getCosts(){
    return this.http.get(url+'/gastos/all');
  }

  createCosts(data){  
    const option = {headers:this.headers};
    return this.http.post(url+'/gastos/create', data, option);
  }

  createDetails(data){  
    const option = {headers:this.headers};
    return this.http.post(url+'/detalle/create', data, option);
  }

  getCostsById(id) {
    const option = { headers: this.headers };
    return this.http.post(url+'/gastos/getbyid/', id, option);
  }

  editCosts(data) {
    const option = { headers: this.headers };
    return this.http.put(url+'/gastos/edit', data, option);
  }

  editDetails(data) {
    const option = { headers: this.headers };
    return this.http.put(url+'/detalle/edit', data, option);
  }

  deleteCosts(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/gastos/delete', id, option);
  }

  deleteDetails(id) {

    const option = { headers: this.headers };
    return this.http.post(url + '/detalle/delete', id, option);
  }
}
