import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { EstablishmentModel } from 'src/models/establishment.model';
import Swal from 'sweetalert2';
import { EstablishmentsService } from '../../services/establishments.service';
import { CycleService } from '../../../cycle/services/cycle.service';
import { CycleModel } from '../../../../../models/cycle.model';
import {  formatDate } from '@angular/common';

@Component({
  selector: 'app-establishments',
  templateUrl: './establishments.component.html',
  styleUrls: ['./establishments.component.scss']
})
export class EstablishmentsComponent implements OnInit, OnDestroy {

  establishments;
  establishment = new EstablishmentModel();
  cycle = new CycleModel();
  cycles;
  currentDate
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
  constructor(private establishmentsService: EstablishmentsService, private CycleService: CycleService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listEstablishments();
    this.lisCycles();
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getCyclePerFinishtDate();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }

  listEstablishments() {
    this.establishmentsService.getEstablishments().subscribe((resp: any) => {
      this.establishments = resp.establecimientos;
      this.dtTrigger.next(void 0);
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

  lisCycles() {
    this.CycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    })
  }

  getCycle(id) {
    let data = {
      id
    };
    this.CycleService.getCycleById(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
    })
  }

  getCyclePerFinishtDate(){
    let data = {
      fecha_termino : this.currentDate
    };
    this.CycleService.getCycleByFinishDate(data).subscribe(async (resp: any)=>{
      if(resp.code == 200){
        this.cycle = resp.ciclo[0];
      }else{
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
      this.CycleService.sendEmails(data).subscribe((resp: any) => {
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
