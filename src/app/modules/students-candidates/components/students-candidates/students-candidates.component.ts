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
import { EstablishmentsService } from '../../../establishments/services/establishments.service';
import { NgForm } from '@angular/forms';
import { StudentsCandidatesService } from '../../services/students-candidates.service';

@Component({
  selector: 'app-students-candidates',
  templateUrl: './students-candidates.component.html',
  styleUrls: ['./students-candidates.component.scss']
})
export class StudentsCandidatesComponent implements OnInit, OnDestroy {

  studentsPerCycle = [];
  establishments;
  establishmentName;
  selectedFile: File = null;
  fileName: string;
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
  constructor(private studentsService: StudentsService, private modalService: NgbModal, private CycleService: CycleService, private EstablishmentsService: EstablishmentsService, private StudentsCandidatesService: StudentsCandidatesService) { }

  ngOnInit(): void {
    this.listCycles();
    this.listEstablishments();
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getCyclePerFinishtDate();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }



  listCycles() {
    this.CycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    })
  }

  listEstablishments() {
    this.EstablishmentsService.getEstablishments().subscribe((resp: any) => {
      this.establishments = resp.establecimientos;
    })
  }

  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.CycleService.getStudentsCandidatePerCyclePerFinishDate(data).subscribe(async (resp: any) => {
      if (resp.code == 200) {
        console.log(resp.ciclo);
        this.cycle = resp.ciclo;
        this.studentsPerCycle = resp.alumnos;
        this.dtTrigger.next(void 0);
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al cargar el ciclo'
        });
        this.studentsPerCycle = [];
        this.dtTrigger.next(void 0);

      }
    })
  }

  getCycle(id) {
    let data = {
      ciclo_id: id
    };
    this.CycleService.getStudentsCandidatePerCycle(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      console.log(resp);
      if (resp.alumnos == undefined) {
        this.studentsPerCycle = []
      } else {
        this.studentsPerCycle = resp.alumnos;
      }
      this.dtTrigger.unsubscribe();
      this.dtTrigger.next(void 0);
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
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

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    this.fileName = this.selectedFile.name;
  }

  chargeStudentPerForm(modal) {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile,this.fileName);
      formData.append('ciclo_id',this.cycle.id.toString());
      this.StudentsCandidatesService.chargeStudentsPerCycle(formData).subscribe((resp: any) => {
        console.log(resp);
        if (resp.code == 200) {
          this.Toast.fire({
            icon: 'success',
            title: 'Se cargaron correctamente los alumnos',
          });
          modal.dismiss();
          this.getCycle(this.cycle.id);
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al cargar alumnos',
          });
        }
      })
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Seleccione un archivo porfavor',
      });
    }
  }
  
  resetFile(){
    this.fileName = "";
    this.selectedFile = null;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
