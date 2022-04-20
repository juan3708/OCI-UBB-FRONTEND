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
}
