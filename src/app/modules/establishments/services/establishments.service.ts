import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EstablishmentsService {

  constructor(private http: HttpClient) { }

  getEstablishments(){
    return this.http.get(url+'/establecimiento/all');
  }
}
