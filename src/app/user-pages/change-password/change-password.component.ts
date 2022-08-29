import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UserPagesService } from '../services/user-pages.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  user;
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
  constructor(private userPagesService: UserPagesService) { }

  ngOnInit(): void {
    this.user = this.userPagesService.getUser();
  }

  changePassword(form: NgForm) {
    if (form.value.password && form.value.newPassword && form.value.repeatPassword) {
      if (form.value.newPassword === form.value.repeatPassword) {
        let data = {
          passwordActual: form.value.password,
          newPassword: form.value.newPassword,
          user_id: this.user.id
        };
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
        this.userPagesService.changePassword(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            Swal.close();
            form.resetForm();
            this.Toast.fire({
              icon: 'success',
              title: resp.message
            });
          } else {
            Swal.close();
            if (resp.code == 401) {
              this.Toast.fire({
                icon: 'error',
                title: resp.message
              });
            } else {
              this.Toast.fire({
                icon: 'error',
                title: 'Error al realizar la acción'
              });
            }

          }
        })
      } else {
        this.Toast.fire({
          icon: 'info',
          title: 'No coinciden las contraseñas.'
        });
      }
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Ingrese todos los valores por favor'
      });
    }
  }

}
