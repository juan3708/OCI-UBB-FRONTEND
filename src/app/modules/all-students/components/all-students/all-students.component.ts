import { AfterViewInit,Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { StudentModel } from 'src/models/student.model';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { StudentsService } from 'src/app/modules/students/services/students.service';
import { DataTableDirective } from 'angular-datatables';
import { CycleService } from '../../../cycle/services/cycle.service';

@Component({
  selector: 'app-all-students',
  templateUrl: './all-students.component.html',
  styleUrls: ['./all-students.component.scss']
})
export class AllStudentsComponent implements OnInit,OnDestroy,AfterViewInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  students;
  establishments
  cycles;
  student;
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
  constructor(private studentsService: StudentsService, private cycleService:CycleService,private modalService: NgbModal) { }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  rerender(): void {
    if("dtInstance" in this.dtElement){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
    else{
      this.dtTrigger.next();
    }
  }


  ngOnInit(): void {
    this.listStudents();
    this.listEstablishments();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }

  listStudents(){
    this.studentsService.getStudents().subscribe((resp:any)=>{
      this.students=resp.alumnos;
      this.rerender()
    });
  }

  listEstablishments(){
    this.studentsService.getEstablishments().subscribe((resp:any)=>{
      this.establishments=resp.establecimientos;
    });
  }

  openModal( ModalContent ) {
    this.modalService.open( ModalContent, { size : 'lg'} );
  }

  studentFormCreate(rut, name, surname, phoneNumber, email, dateOfBirth, grade, address, parentNumber, parent, establishment, modal){
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
    this.studentsService.createStudent(data).subscribe((resp: any) =>{
      if(resp.code==200){        
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Alumno creado correctamente'
        });
        this.listStudents();
      }else{
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

  setStudent(student){
    this.student = JSON.parse(JSON.stringify(student));
    
  }

  getCycles(){
    this.cycleService.getCycles().subscribe((resp:any)=>{
      if(resp.code == 200){
        this.cycles = resp.ciclos;
      }else{
        this.cycles = [];
      }
    })
  }

  getStudentStatistic(cycle, student) {
    let data = {
      ciclo_id: cycle,
      alumno_id: student
    }
    this.studentsService.getStatistic(data).subscribe((resp: any)=>{
      if(resp.code == 200){
        this.studentStatistic = resp;
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
      }
    })
  }

  studentFormEdit(form: NgForm, modal){
    this.studentsService.editStudent(this.student).subscribe((resp: any)=> {

      if(resp.code == 200){
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Alumno editado correctamente'
        });
        this.listStudents();
      }else{
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
        this.studentsService.deleteStudent(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Alumno eliminado correctamente'
            });
            this.listStudents();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar el alumno',
              text: resp.id 
            });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
