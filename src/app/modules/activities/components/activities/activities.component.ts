import { Component, OnInit } from '@angular/core';
import { ActivitiesModel } from '../../../../../models/activities.model';
import { ActivitiesService } from '../../services/activities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CycleService } from '../../../cycle/services/cycle.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  activities;
  cycles;
  activity = new ActivitiesModel();
  constructor(private activitiesService: ActivitiesService, private CycleService: CycleService, private modalService : NgbModal) { }

  ngOnInit(): void {
    this.listActivities();
    this.listCycles();
  }

  listActivities(){
    this.activitiesService.getActivities().subscribe((resp: any) =>{
      console.log(resp.actividades);
      this.activities = resp.actividades;
      console.log(this.activities);
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
        Swal.fire({
          icon: 'success',
          title: 'Actividad creada correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listActivities();
      }else{
        if (resp.code == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          Swal.fire({
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
        Swal.fire({
          icon: 'success',
          title: 'Actividad editada correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listActivities();
      }else{
        if (resp.code == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          Swal.fire({
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
      title: '¿Está seguro que desea eliminar este alumno?',
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
            Swal.fire({
              icon: 'success',
              title: 'Actividad eliminada correctamente',
              showConfirmButton: false,
              timer: 2000
            });
            this.listActivities();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar la actividad',
              text: resp.id 
            });
          }
        });
      }
    });

  }

}
