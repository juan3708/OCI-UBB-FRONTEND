import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentsCandidatesService {

  private headers = new HttpHeaders(
    {  'Content-Type':  'application/json' }
  );

  constructor(private http: HttpClient) { }

  chargeStudentsPerCycle(data){
    const option = new HttpHeaders();
    option.set('Accept', 'application/json');
    option.delete('Content-Type');
    return this.http.post(url+'/establecimiento/chargestudents',data,{headers: option});
  }
}
