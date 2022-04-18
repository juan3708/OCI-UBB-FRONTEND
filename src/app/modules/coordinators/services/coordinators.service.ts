import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorsService {

  constructor(private http: HttpClient) { }

  getCoordinators(){
    return this.http.get(url+'/coordinador/all');
  }
}
