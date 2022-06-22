import { AfterViewInit,Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CompetenciesModel } from '../../../../../models/competencies.model';
import { CompetenciesService } from '../../services/competencies.service';
import { CycleService } from '../../../cycle/services/cycle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { CycleModel } from '../../../../../models/cycle.model';
import { formatDate } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { CostsService } from '../../../costs/services/costs.service';

@Component({
  selector: 'app-competencies',
  templateUrl: './competencies.component.html',
  styleUrls: ['./competencies.component.scss']
})

export class CompetenciesComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  competition = new CompetenciesModel();
  cycles;
  cycle = new CycleModel();
  detailsPerCost;
  currentDate;
  competencies;
  studentsPerCycle = [];
  studentsAdd = [];
  students = [];
  costs = [];

  ids = [];
  total = 0;

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

  editScorePerStudent = this.fb.group({
    studentScore: this.fb.array([])
  });

  costsFormCreate = this.fb.group({
    date: new FormControl(''),
    price: new FormControl(''),
    competitionType: this.competition.tipo,
    details: this.fb.array([])
  });

  constructor(private CompetenciesService: CompetenciesService, private cycleService: CycleService, private modalService: NgbModal, private costsService: CostsService,private fb: FormBuilder) {
      this.cicloOld = {};
  }

  ngOnInit(): void {
    // this.listcycles();
    //this.listCompetencies();
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

  getDetailsPerCost(cost){
    this.detailsPerCost = cost.detalles;
  }

  get studentScore() {
    return this.editScorePerStudent.controls["studentScore"] as FormArray;
  }

  get details() {
    return this.costsFormCreate.controls["details"] as FormArray;
  }

  addDetail() {
    const detailFormGroup = this.fb.group({
      name: new FormControl(''),
      priceDetail: new FormControl(''),
    });
    this.details.push(detailFormGroup);
  }

  removeDetail(i: number) {
    if (this.details.value[i] != undefined) {
      this.ids.push(this.details.value[i].id);
    }
    this.details.removeAt(i);
  }

  listcycles() {
    this.cycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;

    });
  }

  listCompetenciesPerCycle() {
    let data = {
      id: this.cycle.id
    };
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.competencies = resp.ciclo.competencias;
      this.rerender();
    })
  }

  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.cycleService.getCycleByFinishDate(data).subscribe(async (resp: any)=>{
      if(resp.code == 200){
        this.cycle = resp.ciclo;
        this.competencies = resp.ciclo.competencias;
        this.studentsPerCycle = resp.alumnosParticipantes;
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
      this.competencies = resp.competencias;
      if(resp.alumnosParticipantes.length >=1){
      this.studentsPerCycle = resp.alumnosParticipantes;
      }else{
        this.studentsPerCycle = [];
      }
      this.deleteStudentCompetitionArray();
      this.rerender();
    })
  }

  listCompetencies() {
    this.CompetenciesService.getCompetencies().subscribe((resp: any) => {
      this.competencies = resp.competencias;
      this.rerender();
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }

  competitionFormCreate(type, location, date, modal) {
    let data = {
      tipo: type,
      fecha: date,
      lugar: location,
      ciclo_id: this.cycle.id
    };
    this.CompetenciesService.createCompetencies(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha creado correctamente'
        });
        this.listCompetenciesPerCycle();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores'
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al crear una competencia',
            text: resp.message
          });
        }
      }
    });
  }

  getCompetition(id) {
    let data = {
      id
    };
    this.CompetenciesService.getCompetitionById(data).subscribe((resp: any) => {
      this.competition = resp.competencia
      if(resp.competencia.alumnos.length >=1){
        this.students = resp.competencia.alumnos;
        }else{
          this.students = [];
        }
        if( resp.gastos.length >=1){
          this.costs = resp.gastos;
          }else{
            this.costs = [];
          }
      this.deleteStudentCompetitionArray();
      if (this.students.length >= 1) {
        this.setEditFeeForm();
      }
    });
  }

  setCompetition(competition){
    this.competition = JSON.parse(JSON.stringify(competition));
    this.students = competition.alumnos;
    if(competition.alumnos.length >=1){
      this.students = competition.alumnos;
      }else{
        this.students = [];
      }
    this.deleteStudentCompetitionArray();
    if (this.students.length >= 1) {
      this.setEditFeeForm();
    }

  }

  deleteStudentCompetitionArray() {
    this.students.forEach((s) => {
      this.studentsPerCycle.forEach((sp,index) => {
        if (s.id == sp.id) {
          this.studentsPerCycle.splice(index, 1);
        }
      })
    });
  }

  addOrRemoveStudentAddArray(event, student) {
    if (event) {
      this.studentsAdd.push(student);
    } else {
      this.studentsAdd.splice(this.studentsAdd.indexOf(student), 1);
    }
  }


  addStudents(modal) {
    if (this.studentsAdd.length == 0) {
      this.Toast.fire({
        icon: 'info',
        title: 'No se efectuaron mas cambios'
      });
      modal.dismiss();
      this.clearForm();
      this.getCycle(this.cycle.id);
    } else {
      let data = {
        competencia_id: this.competition.id,
        alumnos_id: this.studentsAdd
      }

      this.CompetenciesService.addStudents(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          this.Toast.fire({
            icon: 'success',
            title: 'Alumnos agregados correctamente',
          });
          modal.dismiss();
          this.getCycle(this.cycle.id);
          this.clearForm();
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al agregar los alumnos a la competencia',
          });
        }
      })
    }
  }

  removeStudent(student) {
    let data = {
      competencia_id: this.competition.id,
      alumno_id: student
    };
    Swal.fire({
      title: '¿Esta seguro que desea eliminar al alumno de la competencia?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.CompetenciesService.deleteStudent(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.students.splice(this.students.indexOf(student), 1);
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha eliminado correctamente',
            });
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

  competitionFormEdit(form: NgForm, modal) {
    this.CompetenciesService.editCompetition(this.competition).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha editado correctamente'
        });
        this.listCompetenciesPerCycle();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'success',
            title: 'Ingrese correctamente los valores'
          });
        } else {
          this.Toast.fire({
            icon: 'success',
            title: 'Error al editar una competencia',
            text: resp.message
          });
        }
      }
    });
  }

  setEditFeeForm() {
    this.students.map((e: any) => {
      const studentScoreForm = this.fb.group({
        id: e.id,
        rut: new FormControl({ value: e.rut, disabled: true }),
        nombre: new FormControl({ value: e.nombre, disabled: true }),
        apellidos: new FormControl({ value: e.apellidos, disabled: true }),
        puntaje: e.pivot.puntaje
      });
      this.studentScore.push(studentScoreForm);
    })
    this.editScorePerStudent.setControl('studentScore', this.studentScore);
  }

  establishmentQuotesEdit(form, modal) {
    let ids = []
    let puntajes = [];
    for (let index = 0; index < this.studentScore.length; index++) {
      ids.push(this.studentScore.value[index].id);
      puntajes.push(this.studentScore.value[index].puntaje);
    }
    let data = {
      competencia_id: this.competition.id,
      alumnos_id: ids,
      puntajes: puntajes
    };
    this.CompetenciesService.updateScores(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se asignaron correctamente los puntajes'
        });
        this.clearForm();
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al asignar los puntajes'
        });
      }
    })
  }

  deleteCompetition(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar esta competencia?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.CompetenciesService.deleteCompetition(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha eliminado correctamente'
            });
            this.listCompetenciesPerCycle();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar la competencia'
            });
          }
        });
      }
    });
  }

  createCosts(form, modal) {
    if (this.details.length > 0) {
      for (let index = 0; index < this.details.length; index++) {
        if (this.details.value[index].name != '') {
          this.total += Number(this.details.value[index].priceDetail);
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese un nombre al detalle'
          });
          return;
        }
      }
      let data = {
        valor: this.total,
        fecha: form.date,
        ciclo_id: this.cycle.id,
        competencia_id: this.competition.id
      }
      this.costsService.createCosts(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          modal.dismiss();
          let gastos_id = resp.gastos.id;
          for (let index = 0; index < this.details.length; index++) {
            let dataDetail = {
              valor: this.details.value[index].priceDetail,
              nombre: this.details.value[index].name,
              gastos_id: gastos_id
            };
            this.costsService.createDetails(dataDetail).subscribe((resp: any) => {
              if (resp.code != 200) {
                this.Toast.fire({
                  icon: 'error',
                  title: 'Error al crear detalle'
                });
                return;
              }
            })
          }
          this.Toast.fire({
            icon: 'success',
            title: 'Se ha creado correctamente'
          });
          this.getCompetition(this.competition.id);
          this.clearForm();
        } else {
          if (resp.code == 400) {
            this.Toast.fire({
              icon: 'error',
              title: 'Ingrese correctamente los valores'
            });
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al crear un gasto',
              text: resp.message
            });
          }
          this.total = 0;
        }
      });
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Ingrese un detalle porfavor'
      });
    }
  }


  clearForm() {
    this.studentsAdd = [];
    this.studentScore.controls.splice(0, this.studentScore.length);
    this.editScorePerStudent.reset();

    this.details.controls.splice(0, this.details.length);
    this.costsFormCreate.reset();
    this.ids = [];
    this.total = 0;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}


