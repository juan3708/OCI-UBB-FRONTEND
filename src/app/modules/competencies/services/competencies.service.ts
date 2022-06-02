import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompetenciesService {

  private headers = new HttpHeaders(
    {  'Content-Type':  'application/json' }
  );

  constructor(private http: HttpClient) { }

  getCompetencies(){
    return this.http.get(url+'/competencia/all');
  }

  createCompetencies(data){  
    const option = {headers:this.headers};
    return this.http.post(url+'/competencia/create', data, option);
  }

  getCompetitionById(id) {
    const option = { headers: this.headers };
    return this.http.post(url+'/competencia/getbyid/', id, option);
  }

  editCompetition(data) {
    const option = { headers: this.headers };
    return this.http.put(url+'/competencia/edit', data, option);
  }

  deleteCompetition(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/competencia/delete', id, option);
  }

  addStudents(data){
    const option = { headers: this.headers };
    return this.http.post(url + '/competencia/attach', data, option);
  }

  deleteStudent(id){
    const option = { headers: this.headers };
    return this.http.post(url + '/competencia/detach', id, option);
  }

  updateScores(data){
    const option = { headers: this.headers };
    return this.http.post(url + '/competencia/updatescores', data, option);
  }
}
