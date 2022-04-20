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
  constructor(private studentsService: StudentsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listStudents();
    this.listEstablishments();
  }

  listStudents(){
    this.studentsService.getStudents().subscribe((resp:any)=>{
      console.log(resp.alumnos);
      this.students=resp.alumnos;
      console.log(this.students);
    });
  }

  listEstablishments(){
    this.studentsService.getEstablishments().subscribe((resp:any)=>{
      console.log(resp.establecimientos);
      this.establishments=resp.establecimientos;
      console.log(this.establishments);
    });
  }

  openModal( ModalContent ) {
    this.modalService.open( ModalContent, { size : 'lg'} );
  }

  studentFormCreate(rut, name, surname, phoneNumber, email, dateOfBirth, grade, address, parentNumber, parent, establishment, modal){
    console.log(rut, name, surname, phoneNumber, email, dateOfBirth, grade, address, parentNumber, parent, establishment);
    console.log(establishment)
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
      console.log(resp);
      if(resp.code===200){        
        modal.dismiss();
        Swal.fire({
          icon: 'success',
          title: 'Alumno creado correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listStudents();
      }else{
        //AQUÍ IRÍA EL SWEETALERT DEL ERROR.
      }
    });
  }

  getStudent(id) {
    let data = {
      id
    };
    this.studentsService.getStudentById(data).subscribe((resp: any) => {
      console.log(id);
      console.log(resp);
      this.student = resp.alumno;
      console.log(this.student);
    });
  }

  studentFormEdit(form: NgForm, modal){
    this.studentsService.editStudent(this.student).subscribe((resp: any)=> {
      console.log(resp);
      if(resp.code == 200){
        modal.dismiss();
        Swal.fire({
          icon: 'success',
          title: 'Alumno editado correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listStudents();
      }else{
        if (resp.code == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al editar el alumno',
            text: resp.message
          });
        }
      }
    })
  }
}