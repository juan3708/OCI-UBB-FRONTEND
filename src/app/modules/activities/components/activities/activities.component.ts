import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivitiesModel } from '../../../../../models/activities.model';
import { ActivitiesService } from '../../services/activities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CycleService } from '../../../cycle/services/cycle.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { CycleModel } from '../../../../../models/cycle.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  activities;
  cycles;
  cycle = new CycleModel();
  currentDate;
  activity = new ActivitiesModel();
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
  constructor(private activitiesService: ActivitiesService, private CycleService: CycleService, private modalService : NgbModal) { }

  ngOnInit(): void {
    //this.listActivities();
    this.listCycles();
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getCyclePerFinishtDate();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }

  listActivities(){
    this.activitiesService.getActivities().subscribe((resp: any) =>{
      this.activities = resp.actividades;
      this.dtTrigger.next(void 0);
    })
  }

  listActivitiesPerCycle(){
    let data = {
      id: this.cycle.id
    };
    this.CycleService.getCycleById(data).subscribe((resp: any) => {
      this.activities = resp.ciclo.actividades;
      this.dtTrigger.unsubscribe();
      this.dtTrigger.next(void 0);
    })
  }

  listCycles(){
    this.CycleService.getCycles().subscribe((resp: any)=>{
      this.cycles = resp.ciclos;
    })
  }

  getCyclePerFinishtDate(){
    let data = {
      fecha_termino : this.currentDate
    };
    this.CycleService.getCycleByFinishDate(data).subscribe(async (resp: any)=>{
      if(resp.code == 200){
        this.cycle = resp.ciclo;
        this.activities = resp.ciclo.actividades;
        this.dtTrigger.next(void 0);
      }else{
        this.Toast.fire({
          icon: 'error',
          title: 'Error al cargar el ciclo'
        });
      }
    })
  }

    getCycle(id) {
    let data = {
      id
    };
    this.CycleService.getCycleById(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.activities = resp.ciclo.actividades;
      this.dtTrigger.unsubscribe();
      this.dtTrigger.next(void 0);
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  activityFormCreate(name, description, date, modal){
    let data = {
      nombre: name,
      descripcion: description,
      fecha: date,
      ciclo_id: this.cycle.id
    };
    this.activitiesService.createActivity(data).subscribe((resp:any)=>{
      if(resp.code===200){        
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha creado correctamente'
        });
        this.listActivitiesPerCycle();
      }else{
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores'
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al crear la actividad',
            text: resp.message
          });
        }
      }
    })
  }

  getActivity(id){
    let data = {
      id
    };
    this.activitiesService.getActivityById(data).subscribe((resp: any)=>{
      this.activity = resp.actividad;
    })
  }

  activityFormEdit(form: NgForm, modal){
    this.activitiesService.editActivity(this.activity).subscribe((resp: any)=>{
      if(resp.code == 200){
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Actividad editada correctamente',
        });
        this.listActivitiesPerCycle();
      }else{
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al editar la actividad',
            text: resp.message
          });
        }
      }
    })
  }

  deleteActivity(id){
    let data = {
      id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar esta actividad?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activitiesService.deleteActivity(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Actividad eliminada correctamente',
            });
            this.listActivitiesPerCycle();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar la actividad',
              text: resp.id 
            });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
}

}
