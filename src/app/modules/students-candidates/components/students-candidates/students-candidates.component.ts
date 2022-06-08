import { AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
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
import { StudentsCandidatesService } from '../../services/students-candidates.service';

@Component({
  selector: 'app-students-candidates',
  templateUrl: './students-candidates.component.html',
  styleUrls: ['./students-candidates.component.scss']
})
export class StudentsCandidatesComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  studentsPerCycle = [];
  studentsEnrolled = [];
  establishments = [];
  establishmentName;
  selectedFile: File = null;
  fileName: string;
  studentsAdd = [];
  cupos = [];
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
  constructor(private studentsService: StudentsService, private modalService: NgbModal, private cycleService: CycleService, private EstablishmentsService: EstablishmentsService, private StudentsCandidatesService: StudentsCandidatesService) { 
    this.cicloOld = {};
  }

  ngOnInit(): void {
    // this.listCycles();
    // this.listEstablishments();
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


  listCycles() {
    this.cycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    })
  }

  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.cycleService.getStudentsCandidatePerCyclePerFinishDate(data).subscribe(async (resp: any) => {
      if (resp.code == 200) {
        this.cycle = resp.ciclo;
        this.studentsPerCycle = resp.alumnosInscritos;
        this.studentsEnrolled = resp.alumnosParticipantes;
        this.establishments = resp.establecimientos;
        for (let index = 0; index < this.establishments.length; index++) {
          this.cupos.push(this.establishments[index].alumnosParticipantes.length);
        }
        this.rerender();
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al cargar el ciclo'
        });
        this.studentsPerCycle = [];
        this.rerender();

      }
    })
  }

  getCycle(id) {
    let data = {
      ciclo_id: id
    };
    this.cycleService.getStudentsCandidatePerCycle(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.studentsPerCycle = resp.alumnosInscritos;
      this.studentsEnrolled = resp.alumnosParticipantes;
      this.establishments = resp.establecimientos;
      for (let index = 0; index < this.establishments.length; index++) {
        this.cupos.push(this.establishments[index].alumnosParticipantes.length);
      }
    
      this.rerender();
    });
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
      formData.append('file', this.selectedFile, this.fileName);
      formData.append('ciclo_id', this.cycle.id.toString());
      this.StudentsCandidatesService.chargeStudentsPerCycle(formData).subscribe((resp: any) => {
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

  resetFile() {
    this.fileName = "";
    this.selectedFile = null;
  }

  addOrRemoveStudents(event, student, index) {
    if (this.establishments[index].cupos > this.cupos[index]) {
      if (event) {
        this.studentsAdd.push(student);
        this.cupos[index]++;
      } else {
        this.studentsAdd.splice(this.studentsAdd.indexOf(student), 1);
        this.cupos[index]--;
      }
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'El establecimiento ha superado sus cupos maximos.',
      });
    }
  }

  updateCandidates(modal) {
    if (this.studentsAdd.length == 0) {
      this.Toast.fire({
        icon: 'info',
        title: 'No se efectuaron mas cambios',
      });
      this.clearForm();
      this.getCycle(this.cycle.id);
      modal.dismiss();
    } else {
      let data = {
        ciclo_id: this.cycle.id,
        alumnos_id: this.studentsAdd,
        participante: 1
      };

      this.cycleService.updateCandidates(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          this.Toast.fire({
            icon: 'success',
            title: 'Se han inscritos correctamente',
          });
          this.clearForm();
          this.getCycle(this.cycle.id);
          modal.dismiss();
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al inscribir alumnos',
            text: resp.message
          });
        }
      })
    }
  }

  removeStudent(id, indexEstablishments, indexStudent) {
    let data = {
      ciclo_id: this.cycle.id,
      alumnos_id: id,
      participante: 0
    };
    Swal.fire({
      title: '¿Esta seguro que desea desincribir al alumno?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cycleService.updateCandidates(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.establishments[indexEstablishments].alumnosParticipantes.splice(indexStudent, 1);
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha realizado correctamente',
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  clearForm() {
    this.studentsAdd = [];
    this.cupos = [];
    this.establishments = [];
  }

}
