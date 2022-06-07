import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { url } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AllNewsService {

  private headers = new HttpHeaders({ "Content-Type": "application/json" });
  constructor(private http: HttpClient) {}

  getNews() {
    return this.http.get(url + '/noticia/all');
  }

  createNews(data) {
    const option = { headers: this.headers };
    return this.http.post(url + '/noticia/create', data, option);
  }

  getNewsById(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/noticia/getbyid/', id, option);
  }

  editNews(data) {
    const option = { headers: this.headers };
    return this.http.put(url + '/noticia/edit', data, option);
  }

  deleteNews(id) {
    const option = { headers: this.headers };
    return this.http.post(url + '/noticia/delete', id, option);
  }

  chargePhotosPerNews(data){
    const option = new HttpHeaders();
    option.set('Accept', 'application/json');
    option.delete('Content-Type');
    return this.http.post(url+'/image/add',data,{headers: option});
  }
}
