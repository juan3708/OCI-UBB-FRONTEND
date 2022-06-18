import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EstablishmentsService {

  private headers = new HttpHeaders(
    {  'Content-Type':  'application/json' }
  );

  constructor(private http: HttpClient) { }

  getEstablishments(){
    return this.http.get(url+'/establecimiento/all');
  }

  createEstablishment(data){  
    const option = {headers:this.headers};
    return this.http.post(url+'/establecimiento/create', data, option);
  }

  getEstablishmentById(id) {
    const option = { headers: this.headers };
    return this.http.post(url+'/establecimiento/getbyid/', id, option);
  }

  editEstablishment(data) {
    const option = { headers: this.headers };
    return this.http.put(url+'/establecimiento/edit', data, option);
  }

  deleteEstablecimiento(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/establecimiento/delete', id, option);
  }

  deleteEstablishmentPerCycle(data){
    const option = { headers: this.headers };
    return this.http.post(url + '/ciclo/deleteestablishments', data, option);
  }

  sendMessage(data){
    const option = { headers: this.headers };
    return this.http.post(url +'/mail/messages', data, option);
  }
}
