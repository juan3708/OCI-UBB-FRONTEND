import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { url } from "src/environments/environment";


@Injectable({
  providedIn: "root",
})
export class UserPagesService {

  private headers = new HttpHeaders({ "Content-Type": "application/json" });
  helper = new JwtHelperService();
  constructor(private http: HttpClient) {}

  register(data) {
    const option = { headers: this.headers };
    return this.http.post(url+'/usuario/register', data, option);
  }

  login(data) {
    const option = { headers: this.headers };
    return this.http.post(url+'/usuario/login', data, option);
  }

  saveToken(token){
    localStorage.setItem('access_token', token);
  }

  getUserByToken(){
    let token = localStorage.getItem('access_token');
    let user = this.helper.decodeToken(token).user;
    return user;
  }

  logout(){
    localStorage.removeItem('access_token');
  }
}
