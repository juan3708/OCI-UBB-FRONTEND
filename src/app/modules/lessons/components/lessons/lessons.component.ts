import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CycleService } from 'src/app/modules/cycle/services/cycle.service';
import { CycleModel } from 'src/models/cycle.model';
import { LessonModel } from 'src/models/lesson.model';
import { LevelModel } from 'src/models/level.model';
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
  lesson = new LessonModel();
  cycle = new CycleModel();
  level = new LevelModel();
  levels = [];
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
  constructor(private lessonsService: LessonsService, private cycleService: CycleService, private modalService: NgbModal) { }

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
      this.chargeForCycle(this.lesson.ciclo_id);
      this.getLevelById(this.lesson.nivel_id);
      console.log(this.lesson);
    });
  }

  lessonFormCreate(content, lessonDate, cycle, level, modal) {
    console.log(content, lessonDate, cycle, level);
    let data = {
      contenido: content,
      fecha: lessonDate,
      ciclo_id: cycle,
      nivel_id: level
    };
    this.lessonsService.createLesson(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Clase creada correctamente'
        });
        this.listLessons();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al registrar la clase',
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
        this.Toast.fire({
          icon: 'success',
          title: 'Clase editada correctamente'
        });
        this.listLessons();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
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
            this.Toast.fire({
              icon: 'success',
              title: 'Clase eliminada correctamente'
            });
            this.listLessons();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar la clase',
              text: resp.id 
            });
          }
        })
      }
    })
  }

  chargeForCycle(id) {
    let data = {
      id
    };
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      if (resp.code == 200) {
        this.levels = resp.ciclo.niveles;
      } else {
        this.levels = [];
      }
    })
  }

  getLevelById(id){
    let data = {
      id
    };
    this.lessonsService.getLessonById(data).subscribe((resp: any) => {
      this.level = resp.nivel;
    });
  }
}
