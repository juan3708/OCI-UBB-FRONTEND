import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, DoCheck } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentsService } from '../../services/students.service';
import Swal from 'sweetalert2';
import { StudentModel } from 'src/models/student.model';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { CycleModel } from '../../../../../models/cycle.model';
import { CycleService } from '../../../cycle/services/cycle.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  students;
  establishments;
  currentDate;
  cycle = new CycleModel();
  cycles;
  student;
  see = 0;
  studentStatistic = {
    Asistencias: Array(),
    Porcentaje: 0,
    CantAsistenciasEInasistencias: [{ asistencias: 0, inasistencias: 0 }],
    Competencias: Array()
  };
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
  constructor(private studentsService: StudentsService, private cycleService: CycleService, private modalService: NgbModal) { }

  ngOnInit(): void {
    // this.listStudents();
    // this.listEstablishments();
    //this.listCycles();
    // this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    // this.getCyclePerFinishtDate();
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

  listStudents() {
    this.studentsService.getStudents().subscribe((resp: any) => {
      this.students = resp.alumnos;
      this.rerender();
    });
  }

  listEstablishments() {
    this.studentsService.getEstablishments().subscribe((resp: any) => {
      this.establishments = resp.establecimientos;
    });
  }

  listCycles() {
    this.cycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    });
  }

  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.cycleService.getCycleByFinishDate(data).subscribe(async (resp: any) => {
      if (resp.code == 200) {
        this.cycle = resp.ciclo;
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
      this.students = resp.alumnosParticipantes;
      this.rerender();

    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }

  studentFormCreate(rut, name, surname, phoneNumber, email, dateOfBirth, grade, address, parentNumber, parent, establishment, modal) {
    let data = {
      rut,
      nombre: name,
      apellidos: surname,
      telefono: phoneNumber,
      email,
      fecha_nacimiento: dateOfBirth,
      curso: grade,
      direccion: address,
      telefono_apoderado: parentNumber,
      nombre_apoderado: parent,
      establecimiento_id: establishment
    };
    this.studentsService.createStudent(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Alumno creado correctamente'
        });
        this.listStudents();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al registrar el alumno',
            text: resp.message
          });
        }
      }
    });
  }

  getStudent(id) {
    let data = {
      id
    };
    this.studentsService.getStudentById(data).subscribe((resp: any) => {
      this.student = resp.alumno;
    });
  }

  setStudent(student) {
    this.student = JSON.parse(JSON.stringify(student));
  }

  getStudentStatistic(id) {
    let data = {
      ciclo_id: this.cycle.id,
      alumno_id: id
    }
    this.studentsService.getStatistic(data).subscribe((resp: any)=>{
      if(resp.code == 200){
        this.studentStatistic = resp;
        this.see = 1;
      }else{
        this.Toast.fire({
          icon: 'error',
          title: 'Error al realizar la consulta',
          text: resp.message
        });
        this.studentStatistic = {
          Asistencias: Array(),
          Porcentaje: 0,
          CantAsistenciasEInasistencias: [{ asistencias: 0, inasistencias: 0 }],
          Competencias: Array()
        };
        this.see  = 0;
      }
    })
  }

  studentFormEdit(form: NgForm, modal) {
    this.studentsService.editStudent(this.student).subscribe((resp: any) => {

      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Alumno editado correctamente'
        });
        this.listStudents();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al editar el alumno',
            text: resp.message
          });
        }
      }
    })
  }

  deleteStudent(id) {
    let data = {
      ciclo_id: this.cycle.id,
      alumno_id: id,
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
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha realizado correctamente',
            });
            // this.getCycle();
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
}