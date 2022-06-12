import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPagesService } from '../services/user-pages.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error;
  isError;
  constructor(private userPagesService: UserPagesService, private router: Router) { 
    this.isError = false;
  }

  ngOnInit() {
  }

  login(email, password){
    let data = {
      email,
      password
    }
    this.userPagesService.login(data).subscribe((resp: any) =>{
      this.userPagesService.saveToken(resp.access_token);
      this.router.navigateByUrl('/dashboard');
    }, (error: any) => {
      this.error = 'Credenciales inválidas';
      this.isError = true;
    });
  }
}
