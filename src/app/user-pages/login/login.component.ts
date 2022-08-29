import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { UserPagesService } from "../services/user-pages.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  error;
  isError;
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  constructor(
    private userPagesService: UserPagesService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.isError = false;
  }

  ngOnInit() { }

  login(rut, password) {
    if (rut && password) {
      let data = {
        rut,
        password,
      };
      this.isError = false;
      this.userPagesService.login(data).subscribe(
        (resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha iniciado sesión correctamente'
            });
            this.userPagesService.saveToken(resp.access_token);
            this.router.navigateByUrl("/dashboard");
          } else {
            if (resp.code == 402) {
              this.error = resp.message;
              this.isError = true;
            } else {
              if (resp.code == 400) {
                this.error = resp.message;
                this.isError = true;
              } else {
                if (resp.code == 401) {
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
    } else {
      this.error = 'Ingrese los valores';
      this.isError = true;
    }
  }

  resetPassword(rut, email, modal) {
    if (rut && email) {
      let data = {
        rut,
        email,
        fecha: formatDate(new Date(), 'yyyy-MM-dd', 'en')
      }
      this.isError = false;
      Swal.fire({
        title: 'Espere por favor...',
        didOpen: () => {
          Swal.showLoading()
        },
        willClose: () => {
          Swal.hideLoading()
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      this.userPagesService.resetPassword(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          Swal.close();
          this.Toast.fire({
            icon: 'success',
            title: resp.message
          });
          modal.dismiss();
        } else {
          if (resp.code == 401) {
            this.error = resp.message;
            this.isError = true;
          } else {
            this.error = 'Error al buscar el usuario';
            this.isError = true;
          }
          Swal.close();
        }
      })
    } else {
      this.error = 'Ingrese los valores';
      this.isError = true;
      Swal.close();
    }

  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }
}
