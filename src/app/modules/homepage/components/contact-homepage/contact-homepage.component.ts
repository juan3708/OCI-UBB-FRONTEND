import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HomepageService } from '../../services/homepage.service';

@Component({
  selector: 'app-contact-homepage',
  templateUrl: './contact-homepage.component.html',
  styleUrls: ['./contact-homepage.component.scss']
})
export class ContactHomepageComponent implements OnInit {

  emailsRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/img;
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

  constructor(private homePageService: HomepageService) { }

  ngOnInit(): void {
  }

  sendEmail(name, email, subject, content) {
    let bool = this.emailsRegex.test(email);
    if (bool) {
      let data = {
        name,
        email,
        subject,
        content
      }

      this.homePageService.sendContactEmails(data).subscribe((resp: any) => {
        console.log(resp);
        if (resp.code == 200) {
          this.Toast.fire({
            icon: 'success',
            title: 'Mensaje enviado correctamente'
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al enviar mensaje'
          });
        }
      })
    }else{
      this.Toast.fire({
        icon: 'error',
        title: 'Formato de email incorrecto'
      });
    }
  }

}
