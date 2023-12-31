import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, DoCheck } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { EstablishmentModel } from 'src/models/establishment.model';
import Swal from 'sweetalert2';
import { CycleService } from '../../../cycle/services/cycle.service';
import { EstablishmentsService } from 'src/app/modules/establishments/services/establishments.service';
import { DataTableDirective } from 'angular-datatables';
import { CycleModel } from '../../../../../models/cycle.model';

@Component({
  selector: 'app-all-establishments',
  templateUrl: './all-establishments.component.html',
  styleUrls: ['./all-establishments.component.scss']
})
export class AllEstablishmentsComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  spinnerSee = false;
  cycle = new CycleModel();
  establishments;
  emailsArray = [];
  emailsRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/img;
  establishment = new EstablishmentModel();
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
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
  constructor(private establishmentsService: EstablishmentsService, private cycleService: CycleService, private modalService: NgbModal) { }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngDoCheck(): void {
    if (this.cycleService.cycle.id != undefined) {
      this.cicloNew = this.cycleService.cycle;
      if (this.cicloOld != this.cicloNew) {
        this.cicloOld = this.cicloNew;
        this.getCycle(this.cicloNew.id);
      }
    }
  }

  getCycle(id) {
    let data = {
      id
    };
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
    })
  }

  sendInvitations(to, subject, content, formLink, modal) {
    if (subject == '' || content == '') {
      this.Toast.fire({
        icon: 'error',
        title: 'Por favor llenar todo los campos con asterisco (*)'
      });
    } else {
      this.establishments.forEach(e => {
        this.emailsArray.push(e.email, e.email_profesor);
      });
      if (to != '') {
        let bool = this.emailsRegex.test(to);
        if (bool) {
          this.emailsArray.push(to);
          let data = {
            emails: this.emailsArray,
            subject,
            content,
            formLink,
            start_date: this.cycle.fecha_inicio
          };
          this.spinnerSee = true;
          this.cycleService.sendEmails(data).subscribe((resp: any) => {
            if (resp.code == 200) {
              this.Toast.fire({
                icon: 'success',
                title: 'Mensajes enviados correctamente'
              });
              this.spinnerSee = false;
              modal.dismiss();
            } else {
              this.Toast.fire({
                icon: 'error',
                title: 'Error al enviar los mensajes'
              });
              this.spinnerSee = false;

            }
          })
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Formato de correo incorrecto'
          });
        }
      } else {
        let data = {
          emails: this.emailsArray,
          subject,
          content,
          formLink,
          start_date: this.cycle.fecha_inicio
        };
        this.spinnerSee = true;
        this.cycleService.sendEmails(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Mensajes enviados correctamente'
            });
            this.spinnerSee = false;
            modal.dismiss();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al enviar los mensajes'
            });
            this.spinnerSee = false;

          }
        })
      }
    }
  }

  rerender(): void {
    if ("dtInstance" in this.dtElement) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
    else {
      this.dtTrigger.next();
    }
  }

  ngOnInit(): void {
    this.listEstablishments();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }

  listEstablishments() {
    this.establishmentsService.getEstablishments().subscribe((resp: any) => {
      this.establishments = resp.establecimientos;
      this.rerender();
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }

  establishmentFormCreate(establishmentName, director, establishmentAddress, teacherPhoneNumber, teacherEmail, teacherName, establishmentEmail, establishmentPhoneNumber, modal) {
    let data = {
      nombre: establishmentName,
      director,
      direccion: establishmentAddress,
      telefono_profesor: teacherPhoneNumber,
      email_profesor: teacherEmail,
      nombre_profesor: teacherName,
      email: establishmentEmail,
      telefono: establishmentPhoneNumber
    };
    this.establishmentsService.createEstablishment(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Establecimiento creado correctamente'
        });
        this.listEstablishments();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al registrar el establecimiento',
            text: resp.message
          });
        }
      }
    })
  }

  getEstablishment(id) {
    let data = {
      id
    };
    this.establishmentsService.getEstablishmentById(data).subscribe((resp: any) => {
      this.establishment = resp.establecimiento;
    });
  }

  setEstablishment(establishment) {
    this.establishment = JSON.parse(JSON.stringify(establishment));
  }

  establishmentFormEdit(form: NgForm, modal) {
    this.establishmentsService.editEstablishment(this.establishment).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Establecimiento editado correctamente'
        });
        this.listEstablishments();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al editar el establecimiento',
            text: resp.message
          });
        }
      }
    })
  }

  deleteEstablishment(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar este establecimiento?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.establishmentsService.deleteEstablecimiento(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Establecimiento eliminado correctamente',
              showConfirmButton: false,
              timer: 2000
            });
            this.listEstablishments();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar el establecimiento',
              text: resp.id
            });
          }
        })
      }
    })
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
