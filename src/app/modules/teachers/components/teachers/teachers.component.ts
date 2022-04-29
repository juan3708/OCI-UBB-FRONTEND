import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeacherModel } from 'src/models/teacher.model';
import Swal from 'sweetalert2';
import { TeachersService } from '../../services/teachers.service';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {

  teachers;
  teacher = new TeacherModel();
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
  constructor(private teachersService: TeachersService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listTeachers();
  }

  listTeachers() {
    this.teachersService.getTeachers().subscribe((resp: any) => {
      console.log("PROFESORES",resp.profesores);
      this.teachers = resp.profesores;
      console.log("TEACHERS",this.teachers);
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  getTeachers(id) {
    let data = {
      id
    };
    this.teachersService.getTeacherById(data).subscribe((resp: any) => {
      console.log(id);
      console.log(resp);
      this.teacher = resp.profesor;
      console.log(this.teacher);
    });
  }

  teacherFormCreate(rut, name, surname, email, faculty, modality, modal) {
    console.log(rut, name, surname, email, faculty, modality);
    let data = {
      rut,
      nombre: name,
      apellidos: surname,
      email,
      facultad: faculty,
      modalidad: modality
    };
    console.log(data);
    this.teachersService.createTeacher(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Profesor creado correctamente'
        });
        this.listTeachers();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al registrar al profesor',
            text: resp.message
          });
        }
      }
    })
  }

  teacherFormEdit(form: NgForm, modal){
    this.teachersService.editTeacher(this.teacher).subscribe((resp: any)=> {
      console.log(resp);
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Profesor editado correctamente'
        });
        this.listTeachers();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al editar al profesor',
            text: resp.message
          });
        }
      }
    })
  }

  deleteTeacher(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Esta seguro que desea eliminar este profesor?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.teachersService.deleteTeacher(data).subscribe((resp: any) => {
          console.log(resp);
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Profesor eliminado correctamente'
            });
            this.listTeachers();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar al profesor',
              text: resp.id 
            });
          }
        })
      }
    })
  }
}
