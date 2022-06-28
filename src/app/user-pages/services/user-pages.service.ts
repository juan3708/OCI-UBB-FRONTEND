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

  getUser(){
    let token = localStorage.getItem('access_token');
    if(token != null){
      let user = this.helper.decodeToken(token).user;
      return user;
    }else{
      return false;
    }
  }

  logout(){
    localStorage.removeItem('access_token');
  }

  resetPassword(data) {
    const option = { headers: this.headers };
    return this.http.post(url+'/usuario/resetpassword', data, option);
  }

  changePassword(data) {
    const option = { headers: this.headers };
    return this.http.post(url+'/usuario/changepassword', data, option);
  }
 

  getRol(){
    let token = localStorage.getItem('access_token');
    let rol = this.helper.decodeToken(token).user.rol;
    return rol;
  }
}
