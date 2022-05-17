import { Component, OnDestroy, OnInit } from '@angular/core';
import { LevelModel } from '../../../../../models/level.model';
import { LevelService } from '../../services/level.service';
import { CycleService } from '../../../cycle/services/cycle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { EstablishmentsService } from '../../../establishments/services/establishments.service';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { CycleModel } from 'src/models/cycle.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit, OnDestroy {

  level = new LevelModel();
  levels;
  cycles;
  cycle = new CycleModel();
  currentDate;
  students = [];
  establishments;
  studentsIdAddLevel = [];
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
  constructor(private LevelService: LevelService, private CycleService: CycleService, private EstablishmentsService: EstablishmentsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    //this.listLevels();
    this.listCycles();
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getCyclePerFinishtDate();
    //this.listEstablishments();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }
  listLevels() {
    this.LevelService.getLevels().subscribe((resp: any) => {
      this.levels = resp.niveles;
      this.dtTrigger.next(void 0);
    })
  }

  
  listLevelsPerCycle(){
    let data = {
      id: this.cycle.id
    };
    this.CycleService.getCycleById(data).subscribe((resp: any) => {
      this.levels = resp.ciclo.niveles;
      this.dtTrigger.unsubscribe();
      this.dtTrigger.next(void 0);
    })
  }

  listEstablishments() {
    this.EstablishmentsService.getEstablishments().subscribe((resp: any) => {
      this.establishments = resp.establecimientos;
    })
  }

  listCycles() {
    this.CycleService.getCycles().subscribe((resp: any) => {
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
        this.levels = resp.ciclo.niveles;
        this.establishments = resp.ciclo.establecimientos;
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
      this.levels = resp.ciclo.niveles;
      this.establishments = resp.ciclo.establecimientos;
      this.dtTrigger.unsubscribe();
      this.dtTrigger.next(void 0);
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }
  
  addOrRemoveStudent(event, student){
    if(event == true){
      this.studentsIdAddLevel.push(student);
    }else{
      this.studentsIdAddLevel.splice(this.studentsIdAddLevel.indexOf(student),1);
    }
  }


  getStudentsForEstableshments(id) {
    let data = {
      id
    };
    this.EstablishmentsService.getEstablishmentById(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        this.students = resp.establecimiento.alumnos;
      }
    })
  }

  getLevel(id) {
    let data = {
      id
    };
    this.LevelService.getLevelById(data).subscribe((resp: any) => {
      this.level = resp.nivel;
    })
  }

  levelFormCreate(name, modal) {
    let data = {
      nombre: name,
      ciclo_id: this.cycle.id
    };
    this.LevelService.createLevel(data).subscribe((resp: any) => {
      if (resp.code === 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha creado correctamente'
        });
        this.listLevelsPerCycle();
      } else {
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

  levelFormEdit(form: NgForm, modal) {
    this.LevelService.editLevel(this.level).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Nivel editado correctamente',
        });
        this.listLevelsPerCycle();
      } else {
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

  deleteLevel(id) {
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
            this.listLevelsPerCycle();
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

  addLevelStudent(modal) {
    if(this.studentsIdAddLevel.length < 1){
      this.Toast.fire({
        icon: 'error',
        title: 'Seleccione alumnos porfavor'
      });
    }else{
      let data ={
        nivel_id: this.level.id,
        alumnos_id: this.studentsIdAddLevel
      };
      this.LevelService.levelassociate(data).subscribe((resp:any)=>{
        if(resp.code == 200){
          modal.dismiss();
          this.Toast.fire({
            icon: 'success',
            title: 'Se asigno correctamente el nivel'
          });
          this.clearForm();
        }else{
          this.Toast.fire({
            icon: 'error',
            title: 'Error al asignar el nivel'
          });
        }
      })
    }
  }

  clearForm(){
    this.students = [];
    this.studentsIdAddLevel= [];
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
