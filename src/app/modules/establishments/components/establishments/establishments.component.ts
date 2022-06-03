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
  cycle = new CycleModel();
  cycles;
  currentDate;
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
  constructor(private establishmentsService: EstablishmentsService, private cycleService: CycleService, private modalService: NgbModal) { 
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
    if(this.cycleService.cycle.id != undefined){
      this.cicloNew = this.cycleService.cycle;
      if(this.cicloOld != this.cicloNew){
        this.cicloOld = this.cicloNew;
        this.getCycle(this.cicloNew.id);
        console.log("cambio");
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
      this.establishments = resp.ciclo.establecimientos;
      this.rerender();
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
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

  sendInvitations(to, subject, content, formLink, modal) {
    if (to == '' || subject == '' || content == '' || formLink == '') {
      this.Toast.fire({
        icon: 'error',
        title: 'Porfavor rellenar todo los campos'
      });
    } else {

      let data = {
        emails: to,
        subject,
        content,
        formLink,
        start_date: this.cycle.fecha_inicio
      }
      this.cycleService.sendEmails(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          this.Toast.fire({
            icon: 'success',
            title: 'Invitaciones enviadas correctamente'
          });
          modal.dismiss();
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al enviar invitaciones'
          });
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
