import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { url } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersService {

  private headers = new HttpHeaders({
     "Content-Type": "application/json" 
  });

  constructor(private http: HttpClient) {}

  register(data) {
    const option = { headers: this.headers };
    return this.http.post(url + '/usuario/create', data, option);
  }

  getRole(){
    return this.http.get(url+'/rol/all');
  }

  getAllUsers(){
    return this.http.get(url+'/usuario/all')
  }
}
