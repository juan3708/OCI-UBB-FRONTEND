import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { StudentModel } from 'src/models/student.model';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { StudentsService } from 'src/app/modules/students/services/students.service';
import { CycleModel } from 'src/models/cycle.model';
import { CycleService } from '../../../cycle/services/cycle.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-students-candidates',
  templateUrl: './students-candidates.component.html',
  styleUrls: ['./students-candidates.component.scss']
})
export class StudentsCandidatesComponent implements OnInit, OnDestroy {

  studentsPerCycle;
  establishments;
  establishmentName;
  cycles;
  currentDate;
  cycle = new CycleModel();
  student = new StudentModel();
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
  constructor(private studentsService: StudentsService, private modalService: NgbModal,private CycleService: CycleService) { }

  ngOnInit(): void {
    this.listCycles();
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getCyclePerFinishtDate();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }


  getCyclePerFinishtDate(){
    let data = {
      fecha_termino : this.currentDate
    };
    this.CycleService.getStudentsCandidatePerCyclePerFinishDate(data).subscribe(async (resp: any)=>{
      if(resp.code == 200){
        this.cycle = resp.ciclo;
        this.studentsPerCycle = resp.alumnos;
        this.dtTrigger.next(void 0);
      }else{
        this.Toast.fire({
          icon: 'error',
          title: 'Error al cargar el ciclo'
        });
      }
    })
  }
  listCycles() {
    this.CycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    })
  }
  getCycle(id) {
    let data = {
      id
    };
    this.CycleService.getStudentsCandidatePerCycle(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.studentsPerCycle = resp.alumnos;
      this.dtTrigger.unsubscribe();
      this.dtTrigger.next(void 0);
    })
  }

  openModal( ModalContent ) {
    this.modalService.open( ModalContent, { size : 'xl'} );
  }

  getStudent(id) {
    let data = {
      id
    };
    this.studentsService.getStudentById(data).subscribe((resp: any) => {
      this.student = resp.alumno;
      this.establishmentName = resp.alumno.establecimiento.nombre;
    });
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
