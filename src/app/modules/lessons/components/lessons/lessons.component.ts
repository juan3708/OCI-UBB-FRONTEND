import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CycleService } from 'src/app/modules/cycle/services/cycle.service';
import { CycleModel } from 'src/models/cycle.model';
import { LessonModel } from 'src/models/lesson.model';
import { LevelModel } from 'src/models/level.model';
import Swal from 'sweetalert2';
import { LessonsService } from '../../services/lessons.service';
import { LevelService } from '../../../level/services/level.service';
import { EstablishmentsService } from '../../../establishments/services/establishments.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {

  lessons;
  cycles;
  establishments;
  bool;
  lesson = new LessonModel();
  cycle = new CycleModel();
  level = new LevelModel();
  levels = [];
  studentsPerLevel = [];
  studentsId = [];
  studentsAssistance = [];
  students = [];
  studentsManualAdd = [];
  studentsLesson = [];
  studentList;
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
  constructor(private lessonsService: LessonsService, private cycleService: CycleService, private LevelService: LevelService, private EstablishmentsService: EstablishmentsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listLessons();
    this.listCycles();
  }

  listLessons() {
    this.lessonsService.getLessons().subscribe((resp: any) => {
      this.lessons = resp.clases;
    });
  }

  listCycles() {
    this.lessonsService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    });
  }

  listEstablishments() {
    this.EstablishmentsService.getEstablishments().subscribe((resp: any) => {
      this.establishments = resp.establecimientos;
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }


  getLevelById(id) {
    let data = {
      id
    };
    this.lessonsService.getLessonById(data).subscribe((resp: any) => {
      this.level = resp.nivel;
    });
  }

  getStudentsForEstableshments(id) {
    let data = {
      id
    };
    this.EstablishmentsService.getEstablishmentById(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        this.students = resp.establecimiento.alumnos;
      }
    })
  }

  lessonFormCreate(content, lessonDate, cycle, level, modal) {
    let data = {
      contenido: content,
      fecha: lessonDate,
      ciclo_id: cycle,
      nivel_id: level
    };
    if (this.studentsPerLevel.length >= 1) {
      this.lessonsService.createLesson(data).subscribe(async (resp: any) => {
        if (resp.code == 200) {
          this.AssignStudentToLesson(resp.clase.id);
          await new Promise(f => setTimeout(f, 500));
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
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Porfavor seleccione alumnos',
      });
    }

  }

  lessonFormEdit(form: NgForm, modal) {
    this.lessonsService.editLesson(this.lesson).subscribe((resp: any) => {
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

  async deleteLesson(id) {
    this.getLesson(id);
    await new Promise(f => setTimeout(f, 800));
    if (this.studentsLesson.length >= 1) {
      this.studentsId = this.studentsLesson.map((s: any) => {
        return s.id;
      });
    }
    let data = {
      clase_id: id,
      alumnos_id: this.studentsId

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

  getLesson(id) {
    let data = {
      id
    };
    this.lessonsService.getLessonById(data).subscribe((resp: any) => {
      this.lesson = resp.clase;
      this.chargeForCycle(this.lesson.ciclo_id);
      this.getLevelById(this.lesson.nivel_id);
      this.studentsLesson = resp.clase.alumnos;
    });

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



  chargeStudentsPerLevel(level) {
    this.studentsPerLevel = [];
    if (level != 'undefined') {
      let data = {
        id: level
      };
      this.LevelService.getLevelById(data).subscribe((resp: any) => {
        this.studentsPerLevel = resp.nivel.alumnos;
        if (this.studentsPerLevel.length < 1) {
          this.Toast.fire({
            icon: 'error',
            title: 'No existen alumnos asociados al nivel seleccionado',
          });
        }
      });
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Porfavor seleccione un nivel',
      });
    }
  }

  addOrRemoveStudent(event, student) {
    if (event == true) {
      this.studentsManualAdd.push(student);
    } else {
      this.studentsManualAdd.splice(this.studentsManualAdd.indexOf(student), 1);
    }
  }


  async chargeAssistance(lesson){
    this.getLesson(lesson);
    await new Promise(f => setTimeout(f, 800));
    this.studentsAssistance = this.studentsLesson.map((s: any) => {
      let assistance = {
        alumno_id : s.id,
        asistencia: s.pivot.asistencia
      };
      return assistance;
    });
    console.log(this.studentsAssistance);
    this.studentsId = this.studentsAssistance.map((s: any )=>{
      return s.alumno_id;
    });
  }

  changeStatusAssistance(event, student){
    this.studentsAssistance[this.studentsId.indexOf(student)].asistencia = event;
    console.log(this.studentsAssistance);
  }

  editAssistancePerStudent(modal) {
    let Assistance = this.studentsAssistance.map((s: any) =>{
      return s.asistencia
    });
    let data = {
      clase_id : this.lesson.id,
      alumnos_id: this.studentsId,
      asistencias: Assistance
    };
    console.log(data);
    this.lessonsService.UpdateListLesson(data).subscribe((resp: any )=>{
      console.log(resp);
      if(resp.code == 200){
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Asistencia registrada correctamente'
        });
        this.listLessons();
        this.studentsAssistance = [];
      }else{
        modal.dismiss();
        this.Toast.fire({
          icon: 'error',
          title: 'Error al registrar la asistencia'
        });
      }
    })
  }


  addStudents(modal) {
    if (this.studentsManualAdd.length >= 1) {
      this.studentsPerLevel = this.studentsPerLevel.concat(this.studentsManualAdd);
      this.studentsManualAdd = [];
      modal.dismiss();
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Porfavor seleccione un alumno',
      });
    }
  }

  removeStudents(student) {
    this.studentsPerLevel.splice(this.studentsPerLevel.indexOf(student), 1);
  }

  AssignStudentToLesson(lesson_id) {
    this.studentsId = this.studentsPerLevel.map((s: any) => {
      return s.id;
    });
    let data = {
      clase_id: lesson_id,
      alumnos_id: this.studentsId
    };
    this.lessonsService.chargeStudents(data).subscribe((resp: any) => {
      console.log(resp.code);
      if (resp.code != 200) {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al asignar alumnos a la clase',
        });
      }
    })
  }




  clearForm() {
    this.levels = [];
    this.studentsPerLevel = [];
    this.studentsId = [];
    this.students = [];
    this.studentsManualAdd = [];
  }
}
