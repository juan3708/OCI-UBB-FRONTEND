import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserPagesService } from "../services/user-pages.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  error;
  isError;
  constructor(
    private userPagesService: UserPagesService,
    private router: Router
  ) {
    this.isError = false;
  }

  ngOnInit() {}

  login(rut, password) {
    if (rut && password) {
      let data = {
        rut,
        password,
      };
      this.userPagesService.login(data).subscribe(
        (resp: any) => {
          console.log(resp);
          if(resp.code == 200){
            this.userPagesService.saveToken(resp.access_token);
            this.router.navigateByUrl("/dashboard");
          }else{
            if(resp.code == 402){
              this.error = resp.message;
              this.isError = true;
            }else{
              if(resp.code == 400){
                this.error = resp.message;
                this.isError = true;
              }else{
                if(resp.code == 401){
                  this.error = 'No está autorizado.';
                  this.isError = true;
                }
              }
            }
          }
        },
        (error: any) => {
          this.error = "Credenciales inválidas";
          this.isError = true;
        }
      );
    }else{
      this.error= 'Ingrese los valores';
      this.isError = true;
    }
  }
}
