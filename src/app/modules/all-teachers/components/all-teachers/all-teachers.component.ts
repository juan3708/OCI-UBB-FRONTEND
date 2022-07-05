import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { TeachersService } from 'src/app/modules/teachers/services/teachers.service';
import { TeacherModel } from 'src/models/teacher.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-teachers',
  templateUrl: './all-teachers.component.html',
  styleUrls: ['./all-teachers.component.scss']
})
export class AllTeachersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;


  teachers;
  teacher = new TeacherModel();
  tempTeacher;
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
  constructor(private teachersService: TeachersService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listTeachers();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
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
  listTeachers() {
    this.teachersService.getTeachers().subscribe((resp: any) => {
      this.teachers = resp.profesores;
      this.rerender();
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }

  getTeachers(id) {
    let data = {
      id
    };
    this.teachersService.getTeacherById(data).subscribe((resp: any) => {
      this.teacher = resp.profesor;
    });
  }

  setTeacher(teacher: TeacherModel){
    this.teacher = JSON.parse(JSON.stringify(teacher));
  }

  teacherFormCreate(rut, name, surname, email, faculty, modality, modal) {
    let data = {
      rut,
      nombre: name,
      apellidos: surname,
      email,
      facultad: faculty,
      modalidad: modality
    };
    this.teachersService.createTeacher(data).subscribe((resp: any) => {
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

  teacherFormEdit(form: NgForm, modal) {
    this.teachersService.editTeacher(this.teacher).subscribe((resp: any) => {
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


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
