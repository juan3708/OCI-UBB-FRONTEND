import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonModel } from 'src/models/lesson.model';
import Swal from 'sweetalert2';
import { LessonsService } from '../../services/lessons.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {

  lessons;
  cycles;
  lesson = new LessonModel
  constructor(private lessonsService: LessonsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listLessons();
    this.listCycles();
  }

  listLessons() {
    this.lessonsService.getLessons().subscribe((resp: any) => {
      console.log(resp.clases);
      this.lessons = resp.clases;
      console.log(this.lessons);
    });
  }

  listCycles() {
    this.lessonsService.getCycles().subscribe((resp: any) => {
      console.log(resp.ciclos);
      this.cycles = resp.ciclos;
      console.log(this.cycles);
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  getLessons(id) {
    let data = {
      id
    };
    this.lessonsService.getLessonById(data).subscribe((resp: any) => {
      console.log(id);
      console.log(resp);
      this.lesson = resp.clase;
      console.log(this.lesson);
    });
  }

  lessonFormCreate(content, lessonDate, cycle, modal) {
    console.log(content, lessonDate, cycle);
    let data = {
      contenido: content,
      fecha: lessonDate,
      ciclo_id: cycle
    };
    this.lessonsService.createLesson(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.code == 200) {
        modal.dismiss();
        Swal.fire({
          icon: 'success',
          title: 'Clase creada correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listLessons();
      } else {
        if (resp.code == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al crear la clase',
            text: resp.message
          });
        }
      }
    })
  }

  lessonFormEdit(form: NgForm, modal){
    this.lessonsService.editLesson(this.lesson).subscribe((resp: any)=> {
      console.log(resp);
      if (resp.code == 200) {
        modal.dismiss();
        Swal.fire({
          icon: 'success',
          title: 'Clase editada correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listLessons();
      } else {
        if (resp.code == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al editar la clase',
            text: resp.message
          });
        }
      }
    })
  }

  deleteLesson(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Esta seguro que desea eliminar esta clase?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.lessonsService.deleteLesson(data).subscribe((resp: any) => {
          console.log(resp);
          if (resp.code == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Clase eliminada correctamente',
              showConfirmButton: false,
              timer: 2000
            });
            this.listLessons();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar la clase',
              text: resp.id 
            });
          }
        })
      }
    })
  }
}
