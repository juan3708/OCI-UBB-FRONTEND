import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivitiesModel } from '../../../../../models/activities.model';
import { ActivitiesService } from '../../services/activities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CycleService } from '../../../cycle/services/cycle.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  activities;
  cycles;
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
    this.listActivities();
    this.listCycles();
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

  listCycles(){
    this.CycleService.getCycles().subscribe((resp: any)=>{
      this.cycles = resp.ciclos;
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  activityFormCreate(name, description, date, cycle, modal){
    let data = {
      nombre: name,
      descripcion: description,
      fecha: date,
      ciclo_id: cycle
    };
    this.activitiesService.createActivity(data).subscribe((resp:any)=>{
      if(resp.code===200){        
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha creado correctamente'
        });
        this.listActivities();
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
        this.listActivities();
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
            this.listActivities();
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
