import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentsService } from '../../services/students.service';
import Swal from 'sweetalert2';
import { StudentModel } from 'src/models/student.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  students;
  establishments;
  student = new StudentModel();
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
  constructor(private studentsService: StudentsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listStudents();
    this.listEstablishments();
  }

  listStudents(){
    this.studentsService.getStudents().subscribe((resp:any)=>{
      this.students=resp.alumnos;
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
}