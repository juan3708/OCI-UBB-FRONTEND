import { AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { EstablishmentModel } from 'src/models/establishment.model';
import Swal from 'sweetalert2';
import { EstablishmentsService } from '../../services/establishments.service';
import { CycleService } from '../../../cycle/services/cycle.service';
import { CycleModel } from '../../../../../models/cycle.model';
import { formatDate } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';

@Component({
  selector: 'app-establishments',
  templateUrl: './establishments.component.html',
  styleUrls: ['./establishments.component.scss']
})
export class EstablishmentsComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  establishments;
  establishment = new EstablishmentModel();
  students = [];
  student;
  urlDownload = "http://127.0.0.1:8000/api/pdf/download/";
  fileName = -1;
  cycle = new CycleModel();
  cycles;
  spinnerSee = false;
  emailsRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/img;
  currentDate;
  emailsArray = [];
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
  constructor(private establishmentsService: EstablishmentsService, private cycleService: CycleService, private modalService: NgbModal, private router: Router) {
    this.cicloOld = {};
  }

  ngOnInit(): void {
    //this.listEstablishmentsPerCycle();
    // this.lisCycles();
    // this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    // this.getCyclePerFinishtDate();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
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

  ngAfterViewInit(): void {
    this.dtTrigger.next();
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


  listEstablishmentsPerCycle() {
    this.cycleService.getCycleById(this.cycle.id).subscribe((resp: any) => {
      console.log(resp);
      this.establishments = resp.ciclo.establecimientos;
      this.rerender();
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl', keyboard: false});
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
        this.listEstablishmentsPerCycle();
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

  lisCycles() {
    this.cycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    })
  }

  getCycle(id) {
    let data = {
      id
    };
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.establishments = resp.ciclo.establecimientos;
      this.rerender();
    })
  }

  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.cycleService.getCycleByFinishDate(data).subscribe(async (resp: any) => {
      if (resp.code == 200) {
        this.cycle = resp.ciclo;
        this.establishments = resp.ciclo.establecimientos;
        this.rerender();
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al cargar el ciclo'
        });
      }
    })
  }

  establishmentFormEdit(form: NgForm, modal) {
    this.establishmentsService.editEstablishment(this.establishment).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Establecimiento editado correctamente'
        });
        this.listEstablishmentsPerCycle();
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

  getStudents(id) {
    let data = {
      ciclo_id: this.cycle.id,
      establecimiento_id: id
    }

    this.cycleService.getStudentAssistancePerCycleAndEstablishment(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        if (resp.estudiantesConEstadisticaDeAsistencia != undefined) {
          this.students = resp.estudiantesConEstadisticaDeAsistencia;
        } else {
          this.students = [];
        }
      }
    })
  }

  setStudent(student) {
    this.student = JSON.parse(JSON.stringify(student));
  }

  deleteEstablishment(id) {
    let data = {
      establecimientos_id: id,
      ciclo_id: this.cycle.id

    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar este establecimiento del ciclo?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.establishmentsService.deleteEstablishmentPerCycle(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Establecimiento eliminado correctamente',
              showConfirmButton: false,
              timer: 2000
            });
            this.listEstablishmentsPerCycle();
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

  sendMessages(subject, content, modal) {
    if (subject == '' || content == '') {
      this.Toast.fire({
        icon: 'error',
        title: 'Porfavor rellenar todo los campos con asterisco(*)'
      });
    } else {
      this.establishments.forEach(e => {
        this.emailsArray.push(e.email, e.email_profesor);
      });
      let data = {
        emails: this.emailsArray,
        subject,
        content,
        cycleName: this.cycle.nombre
      };
      this.spinnerSee = true;
      this.establishmentsService.sendMessage(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          this.Toast.fire({
            icon: 'success',
            title: 'Mensajes enviados correctamente'
          });
          modal.dismiss();
          this.spinnerSee = false;
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

  exportPdf() {
    let data = {
      students: this.students,
      nombreCiclo: this.cycle.nombre,
      nombreEstablecimiento: this.establishment.nombre,
      email: this.establishment.email,
      emailProfesor: this.establishment.email_profesor
    }
    this.spinnerSee = true;
    this.establishmentsService.exportPDF(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        this.fileName = resp.fileName;
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha exportado correctamente'
        });
        this.spinnerSee = false;
        window.location.assign(this.urlDownload + this.fileName);

      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al exportar el archivo'
        });
        this.spinnerSee = false;
      }
    })
  }

  deletePdf() {
    if (this.fileName != -1) {
      let data = {
        fileName: this.fileName
      }
      this.establishmentsService.deletePDF(data).subscribe((resp: any) => { });
      this.fileName = -1;
    }
    console.log('holi')
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
