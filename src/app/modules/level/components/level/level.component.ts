import { Component, OnInit } from '@angular/core';
import { LevelModel } from '../../../../../models/level.model';
import { LevelService } from '../../services/level.service';
import { CycleService } from '../../../cycle/services/cycle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit {

level= new LevelModel();
levels;
cycles;
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
  constructor(private LevelService: LevelService, private CycleService: CycleService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listLevels();
    this.listCycles();
  }
  listLevels(){
    this.LevelService.getLevels().subscribe((resp: any) =>{
      this.levels = resp.niveles;
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

  levelFormCreate(name, cycle, modal){
    let data = {
      nombre: name,
      ciclo_id: cycle
    };
    this.LevelService.createLevel(data).subscribe((resp:any)=>{
      if(resp.code===200){        
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha creado correctamente'
        });
        this.listLevels();
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

  getLevel(id){
    let data = {
      id
    };
    this.LevelService.getLevelById(data).subscribe((resp: any)=>{
      this.level = resp.nivel;
    })
  }

  levelFormEdit(form: NgForm, modal){
    this.LevelService.editLevel(this.level).subscribe((resp: any)=>{
      if(resp.code == 200){
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Nivel editado correctamente',
        });
        this.listLevels();
      }else{
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al editar el nivel',
            text: resp.message
          });
        }
      }
    })
  }

  deleteLevel(id){
    let data = {
      id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar este nivel?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.LevelService.deleteLevel(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Nivel eliminado correctamente',
            });
            this.listLevels();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar el nivel',
              text: resp.id 
            });
          }
        });
      }
    });

  }
}
