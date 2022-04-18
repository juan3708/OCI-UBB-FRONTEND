import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentsService } from '../../services/students.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  students;
  establishments;
  constructor(private studentsService: StudentsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listStudents();
    this.listEstablishments();
  }

  listStudents(){
    this.studentsService.getStudents().subscribe((resp:any)=>{
      console.log(resp.alumno);
      this.students=resp.alumno;
      console.log(this.students);
    });
  }

  listEstablishments(){
    this.studentsService.getEstablishments().subscribe((resp:any)=>{
      console.log(resp.establecimiento);
      this.establishments=resp.establecimiento;
      console.log(this.establishments);
    });
  }

  openModal( ModalContent ) {
    this.modalService.open( ModalContent, { size : 'lg'} );
  }

  studentForm(rut, name, surname, phoneNumber, email, dateOfBirth, grade, address, parentNumber, parent, establishment, modal){
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
}