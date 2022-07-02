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

  constructor(private http: HttpClient) { }

  register(data) {
    const option = { headers: this.headers };
    return this.http.post(url + '/usuario/create', data, option);
  }

  edit(data) {
    const option = { headers: this.headers };
    return this.http.post(url + '/usuario/edit', data, option);
  }

  getRole() {
    return this.http.get(url + '/rol/all');
  }

  getAllUsers() {
    return this.http.get(url + '/usuario/all')
  }

  changeStatus(data) {
    const option = { headers: this.headers };
    return this.http.post(url + '/usuario/changestatus', data, option);
  }

  sendMessage(data){
    const option = { headers: this.headers };
    return this.http.post(url +'/mail/messages', data, option);
  }

  exportAssistancePerEstablishmentToPDF(data){
    const option = { headers: this.headers };
    return this.http.post(url +'/pdf/assistanceperestablishment',data,option);
  }

  exportGeneralAssistanceToPDF(data){
    const option = { headers: this.headers };
    return this.http.post(url +'/pdf/generalassistance',data,option);
  }

  exportGeneralStatisticToPDF(data){
    const option = { headers: this.headers };
    return this.http.post(url +'/pdf/generalstatistic',data,option);
  }

  exportCosts(data){
    const option = { headers: this.headers };
    return this.http.post(url +'/pdf/costs',data,option);
  }

  deletePDF(data){
    const option = { headers: this.headers };
    return this.http.post(url +'/pdf/delete',data,option);
  }

}
