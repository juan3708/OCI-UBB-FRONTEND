import { DataTableDirective } from 'angular-datatables';
import { AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

export class LevelComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, { static: false })

  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  level = new LevelModel();
  levels;
  levelsLength = 0;
  cycles;
  studentsPerLevel = [];
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
  constructor(private LevelService: LevelService, private cycleService: CycleService, private EstablishmentsService: EstablishmentsService, private modalService: NgbModal) {
    this.cicloOld = {};
  }

  ngOnInit(): void {
    //this.listLevels();
    // this.listCycles();
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    // this.getCyclePerFinishtDate();
    //this.listEstablishments();
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



  listLevels() {
    this.LevelService.getLevels().subscribe((resp: any) => {
      this.levels = resp.niveles;
      this.rerender();
    })
  }


  listLevelsPerCycle() {
    let data = {
      id: this.cycle.id
    };
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.levels = resp.niveles;
      this.rerender();
    })
  }

  listEstablishments() {
    this.EstablishmentsService.getEstablishments().subscribe((resp: any) => {
      this.establishments = resp.establecimientos;
    })
  }

  listCycles() {
    this.cycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    })
  }

  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.cycleService.getCycleByFinishDate(data).subscribe(async (resp: any) => {
      if (resp.code == 200) {
        this.cycle = resp.ciclo;
        this.levels = resp.ciclo.niveles;
        this.establishments = resp.ciclo.establecimientos;
        this.students = resp.alumnosParticipantes;
        this.rerender();
      } else {
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
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.levels = resp.niveles;
      this.levelsLength = this.levels.length;
      this.establishments = resp.ciclo.establecimientos;
      this.rerender();
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }

  addOrRemoveStudent(event, student) {
    if (event == true) {
      this.studentsIdAddLevel.push(student);
    } else {
      this.studentsIdAddLevel.splice(this.studentsIdAddLevel.indexOf(student), 1);
    }
  }


  getLevel(id, ModalContent) {
    let data = {
      id
    };
    Swal.fire({
      title: 'Espere por favor...',
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        Swal.hideLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
    this.LevelService.getLevelById(data).subscribe((resp: any) => {
      this.level = resp.nivel;
      this.studentsPerLevel = resp.nivel.alumnos;
      this.students = resp.alumnosSinNivel;
      Swal.close();
      if (ModalContent != null) {
        this.modalService.open(ModalContent, { size: 'xl' });
      }
    })
  }

  setLevel(level) {
    this.level = JSON.parse(JSON.stringify(level));
    this.studentsPerLevel = level.alumnos;
  }

  assignCycle(id){
    let data = {
      id
    };
    this.cycleService.getCycleById(data).subscribe((resp: any)=>{
      this.cycleService.cycle = resp.ciclo;
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
        this.assignCycle(this.cycle.id);
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores'
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al crear el nivel',
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
            this.assignCycle(this.cycle.id);
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar el nivel',
              text: resp.message
            });
          }
        });
      }
    });

  }

  addLevelStudent(modal) {
    if (this.studentsIdAddLevel.length < 1) {
      this.Toast.fire({
        icon: 'info',
        title: 'No se efectuaron cambios'
      });
      modal.dismiss();
    } else {
      let data = {
        nivel_id: this.level.id,
        alumnos_id: this.studentsIdAddLevel
      };
      this.LevelService.levelassociate(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          modal.dismiss();
          this.Toast.fire({
            icon: 'success',
            title: 'Se asignó correctamente el nivel'
          });
          this.clearForm();
          this.getCycle(this.cycle.id);
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al asignar el nivel'
          });
        }
      })
    }
  }

  removeStudent(student) {
    let data = {
      nivel_id: this.level.id,
      alumno_id: student
    };
    Swal.fire({
      title: '¿Está seguro que desea desincribir al alumno?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.LevelService.deleteStudent(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.studentsPerLevel.splice(this.studentsPerLevel.indexOf(student), 1);
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha eliminado correctamente',
            });
            this.getLevel(this.level.id, null);
          this.getCycle(this.cycle.id);

          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al realizar la acción',
              text: resp.message
            });
          }
        })
      }
    })
  }

  clearForm() {
    this.students = [];
    this.studentsIdAddLevel = [];
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}


