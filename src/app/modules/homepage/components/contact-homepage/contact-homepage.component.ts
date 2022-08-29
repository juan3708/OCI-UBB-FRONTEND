import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HomepageService } from '../../services/homepage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-homepage',
  templateUrl: './contact-homepage.component.html',
  styleUrls: ['./contact-homepage.component.scss']
})
export class ContactHomepageComponent implements OnInit {

  emailsRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/img;
  spinnerSee = false;
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

  constructor(private homePageService: HomepageService, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  sendEmail(form: NgForm) {
    if (form.value.name || form.value.email || form.value.subject || form.value.content) {
      let bool = this.emailsRegex.test(form.value.email);
      if (bool) {
        let data = {
          name: form.value.name,
          email: form.value.email,
          subject: form.value.subject,
          content: form.value.content
        }
        this.spinnerSee = true;
        this.homePageService.sendContactEmails(data).subscribe((resp: any) => {

          console.log(resp);
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Mensaje enviado correctamente'
            });
            form.resetForm();
            this.spinnerSee = false;
          } else {
            this.spinnerSee = false;
            this.Toast.fire({
              icon: 'error',
              title: 'Error al enviar mensaje'
            });
          }
        })
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Formato de correo incorrecto'
        });
      }
    }else{
      this.Toast.fire({
        icon: 'error',
        title: 'Ingrese todo los valores por favor'
      });
    }
  }


  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }

}
