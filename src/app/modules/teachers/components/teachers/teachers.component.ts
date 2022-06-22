import { AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { TeacherModel } from 'src/models/teacher.model';
import Swal from 'sweetalert2';
import { TeachersService } from '../../services/teachers.service';
import { CycleModel } from '../../../../../models/cycle.model';
import { CycleService } from '../../../cycle/services/cycle.service';
import { formatDate } from '@angular/common';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  spinner = new SpinnerComponent()
  teachers;
  teacher;
  cycles;
  cycle = new CycleModel();
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  currentDate;
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
  constructor(private teachersService: TeachersService, private cycleService: CycleService, private modalService: NgbModal) { 
    this.cicloOld = {};
  }

  ngOnInit(): void {
    // this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    // this.listCycles();
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

  listCycles() {
    this.cycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    })
  }

  listTeachersPerCycle() {
    let data = {
      ciclo_id: this.cycle.id
    }
    this.teachersService.getTeachersPerCycle(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        this.teachers = resp.profesores;
        Swal.fire({
          title: 'Espere porfavor',
          timer: 600,
          didOpen: async () => {
            Swal.showLoading()
          },
        })
        this.rerender();
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al cargar el ciclo'
        });
      }
    });
  }

  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.cycleService.getCycleByFinishDate(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.listTeachersPerCycle();


    })
  }

  getCycle(id) {
    let data = {
      ciclo_id: id
    };
    this.cycleService.getStudentsCandidatePerCycle(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.listTeachersPerCycle();
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  getTeachers(id) {
    let data = {
      id
    };
    this.teachersService.getTeacherById(data).subscribe((resp: any) => {
      this.teacher = resp.profesor;
    });
  }

  setTeacher(teacher){
    this.teacher = JSON.parse(JSON.stringify(teacher));
    
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
