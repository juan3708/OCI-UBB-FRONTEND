import { AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { DataTableDirective } from 'angular-datatables';
import { UsersService } from '../../../users/services/users.service';
import { UserPagesService } from '../../../../user-pages/services/user-pages.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  user = {
    rol: {
      nombre: ""
    },
    rut: ""
  };
  lessons = [];
  lessonSee;
  cycles;
  establishments = []
  establishmentMaxStudent;
  establishmentMinStudent;
  bool;
  currentDate;
  totalStudents = 0;
  fileName = -1;
  urlDownload = "http://127.0.0.1:8000/api/pdf/download/";
  spinnerSee = false;
  lesson = new LessonModel();
  cycle = new CycleModel();
  level = new LevelModel();
  levels = [];
  student;
  studentsPerLevel = [];
  studentsId = [];
  studentsAssistance = [];
  students = [];
  studentsAdd = [];
  studentsLesson = [];
  removeStudents = [];
  studentList;
  teachers = [];
  teacher;
  assistant;
  assistants = [];
  lessonTeachers = [];
  lessonAssistants = [];
  addTeachers = [];
  addAssistants = [];
  removeTeachers = [];
  removeAssistants = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dt: Subject<any> = new Subject<any>();
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
  constructor(private lessonsService: LessonsService, private cycleService: CycleService, private LevelService: LevelService, private EstablishmentsService: EstablishmentsService, private usersService: UsersService, private usersPagesService: UserPagesService, private modalService: NgbModal) {
    this.cicloOld = {};
  }

  ngOnInit(): void {
    //this.listLessons();
    // this.listCycles();
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
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
        this.user = this.usersPagesService.getUser();
        if (this.user.rol.nombre == 'profesor') {
          this.listLessonsPerTeacher(this.user.rut, this.cicloNew.id);
        } else if (this.user.rol.nombre == 'ayudante') {
          this.listLessonsPerAssistants(this.user.rut, this.cicloNew.id);
        } else {
          this.getCycle(this.cicloNew.id);
        }
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

  listLessons() {
    this.lessonsService.getLessons().subscribe((resp: any) => {
      this.lessons = resp.clases;
      this.rerender();
    });
  }

  listLessonsPerCycle() {
    let data = {
      id: this.cycle.id
    };
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.lessons = resp.clases;
      this.rerender();

    })
  }

  listLessonsPerTeacher(rut, ciclo_id) {
    let data = {
      rut_profesor: rut,
      ciclo_id: ciclo_id
    };
    this.lessonsService.getLessonsPerCycleAndTeacher(data).subscribe((resp: any) => {
      this.lessons = resp.clases;
      this.teacher = resp.profesor;
      this.levels = resp.ciclo.niveles;
      this.cycle = resp.ciclo;
      this.rerender();
    })
  }

  listLessonsPerAssistants(rut, ciclo_id) {
    let data = {
      rut_ayudante: rut,
      ciclo_id: ciclo_id
    };
    this.lessonsService.getLessonsPerCycleAndAssistant(data).subscribe((resp: any) => {
      this.lessons = resp.clases;
      this.levels = resp.ciclo.niveles;
      this.cycle = resp.ciclo;
      this.rerender();
    })
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

  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.cycleService.getCycleByFinishDate(data).subscribe(async (resp: any) => {
      if (resp.code == 200) {
        this.cycle = resp.ciclo;
        this.lessons = resp.clases;
        this.levels = resp.ciclo.niveles;
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
      this.levels = resp.ciclo.niveles;
      this.lessons = resp.clases;
      this.students = resp.alumnosParticipantes;
      this.rerender();

    })
  }

  getLesson(id, ModalContent) {
    let data = {
      id
    };
    Swal.fire({
      title: 'Espere por favor...',
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        Swal.hideLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
    this.lessonsService.getLessonById(data).subscribe((resp: any) => {
      this.lesson = resp.clase;
      this.studentsLesson = resp.clase.alumnos;
      this.lessonAssistants = resp.clase.ayudantes;
      this.lessonTeachers = resp.clase.profesores;
      this.students = resp.alumnosSinClase;
      this.getLevelById(this.lesson.nivel_id);
      Swal.close();
      if (ModalContent != null) {
        this.modalService.open(ModalContent, { size: 'xl' });
      }

    });

  }

  getStudentAssistancePerCycle(ModalContent) {
    let data = {
      ciclo_id: this.cycle.id
    }
    Swal.fire({
      title: 'Espere por favor...',
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        Swal.hideLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
    this.cycleService.getStudentAssistancePerCycle(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        if (resp.Establecimientos.length >= 1) {
          this.establishments = resp.Establecimientos;
          this.establishmentMaxStudent = resp.EstablecimientoConMasAlumnos;
          this.establishmentMinStudent = resp.EstablecimientoConMenosAlumnos;
          this.totalStudents = resp.TotalAlumnos;
        } else {
          this.establishments = [];
          this.establishmentMaxStudent = [];
          this.establishmentMinStudent = [];


        }
        Swal.close();
        this.modalService.open(ModalContent, { size: 'xl' });

      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al realizar la consulta'
        });
        this.establishments = [];
        Swal.close();
      }
    })
  }
  setLesson(lesson) {
    this.lesson = JSON.parse(JSON.stringify(lesson));


    if (lesson.alumnos.length >= 1) {
      this.studentsLesson = lesson.alumnos;
    } else {
      this.studentsLesson = [];
    }

    if (lesson.ayudantes.length >= 1) {
      this.lessonAssistants = lesson.ayudantes;
    } else {
      this.lessonAssistants = [];
    }

    if (lesson.profesores.length >= 1) {
      this.lessonTeachers = lesson.profesores;
    } else {
      this.lessonTeachers = [];
    }
  }

  setStudent(student) {
    this.student = JSON.parse(JSON.stringify(student));

  }
  getTeachersAndAssistants(id, ModalContent) {
    let data = {
      clase_id: id
    };
    Swal.fire({
      title: 'Espere por favor...',
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        Swal.hideLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
    this.lessonsService.getTeachersAndAssistants(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        if (resp.profesores.length >= 1) {
          this.teachers = resp.profesores;
        } else {
          this.teachers = [];
        }

        if (resp.ayudantes.length >= 1) {
          this.assistants = resp.ayudantes;
        } else {
          this.assistants = [];
        }
        Swal.close();
        if (ModalContent != null) {
          this.modalService.open(ModalContent, { size: 'xl' });
        }
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al realizar la consulta'
        });
        Swal.close();
      }
    })
  }

  lessonFormCreate(content, lessonDate, level, modal) {
    let data = {
      contenido: content,
      fecha: lessonDate,
      ciclo_id: this.cycle.id,
      nivel_id: level
    };
    if (this.studentsId.length >= 1) {
      this.lessonsService.createLesson(data).subscribe(async (resp: any) => {
        if (resp.code == 200) {
          this.AssignStudentToLesson(resp.clase.id);
          await new Promise(f => setTimeout(f, 500));
          this.Toast.fire({
            icon: 'success',
            title: 'Clase creada correctamente'
          });
          if (this.user.rol.nombre == 'profesor') {
            let data = {
              profesores_id: this.teacher.id,
              clase_id: resp.clase.id
            }
            this.lessonsService.ChargeTeachers(data).subscribe((resp1: any) => {
            });
            this.listLessonsPerTeacher(this.user.rut, this.cycle.id);
          } else {
            this.listLessonsPerCycle();
          }
          modal.dismiss();
          this.clearForm();

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
      this.lessonsService.createLesson(data).subscribe(async (resp: any) => {
        if (resp.code == 200) {
          this.Toast.fire({
            icon: 'success',
            title: 'Clase creada correctamente'
          });
          if (this.user.rol.nombre == 'profesor') {
            let data = {
              profesores_id: this.teacher.id,
              clase_id: resp.clase.id
            }
            this.lessonsService.ChargeTeachers(data).subscribe((resp1: any) => {
            });
            this.listLessonsPerTeacher(this.user.rut, this.cycle.id);
          } else {
            this.listLessonsPerCycle();
          }
          modal.dismiss();
          this.clearForm();

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

  }

  lessonFormEdit(form: NgForm, modal) {
    this.lessonsService.editLesson(this.lesson).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Clase editada correctamente'
        });
        if (this.user.rol.nombre == 'profesor') {
          this.listLessonsPerTeacher(this.user.rut, this.cycle.id);
        } else {
          this.listLessonsPerCycle();
        }
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
      clase_id: id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar esta clase?',
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
            if (this.user.rol.nombre == 'profesor') {
              this.listLessonsPerTeacher(this.user.rut, this.cycle.id);
            } else {
              this.listLessonsPerCycle();
            }
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

  chargeStudentsPerLevel(level) {
    this.studentsPerLevel = [];
    if (level != 'undefined') {
      let data = {
        id: level
      };
      this.LevelService.getLevelById(data).subscribe((resp: any) => {
        this.studentsPerLevel = resp.nivel.alumnos;
        this.students = resp.alumnosSinNivel;

      });
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Por favor seleccione un nivel',
      });
    }
  }

  addOrRemoveStudentCreate(event, student) {
    if (event) {
      this.studentsAdd.push(student);
    } else {
      this.studentsAdd.splice(this.studentsAdd.indexOf(student), 1);
    }
  }

  addOrRemoveTeacherAdd(event, teacher) {
    if (event) {
      this.addTeachers.push(teacher);
    } else {
      this.addTeachers.splice(this.addTeachers.indexOf(teacher), 1);
    }
  }

  addOrRemoveAssistantAdd(event, assistant) {
    if (event) {
      this.addAssistants.push(assistant);
    } else {
      this.addAssistants.splice(this.addAssistants.indexOf(assistant), 1);
    }
  }

  removeStudentsPerLevelArray(student) {
    this.studentsPerLevel.splice(this.studentsPerLevel.indexOf(student), 1);
  }

  removeStudentsLessonToLesson(student) {
    let data = {
      clase_id: this.lesson.id,
      alumnos_id: student
    };
    Swal.fire({
      title: '¿Está seguro que desea desasignar al alumno de la clase?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.lessonsService.DeleteTeachers(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.studentsLesson.splice(this.studentsLesson.indexOf(student), 1);
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha desasignado correctamente',
            });
            this.getCycle(this.cycle.id);
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

  removeTeacherToLesson(teacher) {
    let data = {
      clase_id: this.lesson.id,
      profesores_id: teacher
    };
    Swal.fire({
      title: '¿Está seguro que desea desasignar al profesor de la clase?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.lessonsService.DeleteTeachers(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.lessonTeachers.splice(this.lessonTeachers.indexOf(teacher), 1);
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha desasignado correctamente',
            });
            this.getTeachersAndAssistants(this.lesson.id, null);
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

  removeAssistantToLesson(assistant) {
    let data = {
      clase_id: this.lesson.id,
      ayudantes_id: assistant
    };
    Swal.fire({
      title: '¿Está seguro que desea desasignar al ayudante de la clase?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.lessonsService.DeleteAssistants(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.lessonAssistants.splice(this.lessonAssistants.indexOf(assistant), 1);
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha desasignado correctamente',
            });
            this.getTeachersAndAssistants(this.lesson.id, null);
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

  changeStatusAssistance(event, student) {
    this.studentsAssistance[this.studentsId.indexOf(student)].asistencia = event;
  }

  concatStudentsArrays(modal) {
    if (this.studentsPerLevel.length >= 1 || this.studentsAdd.length >= 1) {
      this.studentsId = this.studentsPerLevel.map((s: any) => {
        return s.id;
      });
      this.studentsId = this.studentsId.concat(this.studentsAdd);
      this.studentsAdd = [];
      modal.dismiss();
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Por favor seleccione un alumno',
      });
    }
  }

  AssignStudentToLesson(lesson_id) {
    let data = {
      clase_id: lesson_id,
      alumnos_id: this.studentsId
    };
    this.lessonsService.chargeStudents(data).subscribe((resp: any) => {
      if (resp.code != 200) {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al asignar alumnos a la clase',
        });
      }
    })
  }

  async chargeAssistance(lesson, ModalContent) {
    this.getLesson(lesson, ModalContent);
    this.studentsAssistance = this.studentsLesson.map((s: any) => {
      let assistance = {
        alumno_id: s.id,
        asistencia: s.pivot.asistencia
      };
      return assistance;
    });
    this.studentsId = this.studentsAssistance.map((s: any) => {
      return s.alumno_id;
    });

  }

  editAssistancePerStudent(modal) {
    let Assistance = this.studentsAssistance.map((s: any) => {
      return s.asistencia
    });
    let data = {
      clase_id: this.lesson.id,
      alumnos_id: this.studentsId,
      asistencias: Assistance
    };
    this.lessonsService.UpdateListLesson(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Asistencia registrada correctamente'
        });
        this.listLessons();
        this.studentsAssistance = [];
      } else {
        modal.dismiss();
        this.Toast.fire({
          icon: 'error',
          title: 'Error al registrar la asistencia'
        });
      }
    })
  }

  assignTeachersAndAssistants(modal) {
    var correctTeachers = true;
    var correctAssistants = true;

    if (this.lessonTeachers.length == 0 && this.addTeachers.length == 0) {
      this.Toast.fire({
        icon: 'error',
        title: 'Seleccione un profesor'
      });
    } else {
      if (this.addTeachers.length == 0 && this.addAssistants.length == 0) {
        this.Toast.fire({
          icon: 'info',
          title: 'No se efectuaron cambios'
        });
        modal.dismiss();
      } else {
        let data = {
          clase_id: this.lesson.id,
          profesores_id: this.addTeachers
        }
        if (this.addTeachers.length >= 1) {
          this.lessonsService.ChargeTeachers(data).subscribe((resp: any) => {
            if (resp.code != 200) {
              this.Toast.fire({
                icon: 'error',
                title: 'Error al asignar el profesor'
              });
              correctTeachers = false;
            }
          })
        }
        if (this.addAssistants.length >= 1) {
          let data = {
            clase_id: this.lesson.id,
            ayudantes_id: this.addAssistants
          }
          this.lessonsService.ChargeAssistants(data).subscribe((resp: any) => {
            if (resp.code != 200) {
              this.Toast.fire({
                icon: 'error',
                title: 'Error al asignar el ayudante'
              });
              correctAssistants = false;
            }
          })
        }
        if (correctAssistants && correctTeachers) {
          this.Toast.fire({
            icon: 'success',
            title: 'Se asignaron correctamente profesor(es) y ayudante(s)'
          });
          this.clearForm();
          modal.dismiss();
          this.getCycle(this.cycle.id);
        }
      }
    }
  }

  addStudentPerLesson(modal) {
    if (this.removeStudents.length == 0 && this.studentsAdd.length == 0) {
      this.Toast.fire({
        icon: 'info',
        title: 'No se efectuaron cambios'
      });
      modal.dismiss();
    } else if (this.studentsLesson.length == 0 && this.studentsAdd.length == 0) {
      this.Toast.fire({
        icon: 'error',
        title: 'Debe seleccionar un alumno'
      });
    } else {

      let data = {
        clase_id: this.lesson.id,
        alumnos_id: this.studentsAdd
      };
      this.lessonsService.chargeStudents(data).subscribe((resp: any) => {
        if (resp.code != 200) {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al asignar alumno a la clase'
          });
        } else {
          this.Toast.fire({
            icon: 'success',
            title: 'Se guardaron correctamente los cambios'
          });
          modal.dismiss();
          this.clearForm();
        }
      })

    }
  }

  exportPdf() {
    let data = {
      establecimientos: this.establishments,
      establecimientoConMenosEstudiantes: this.establishmentMinStudent,
      establecimientoConMasEstudiantes: this.establishmentMaxStudent,
      totalAlumnos: this.totalStudents,
      totalEstablecimientos: this.establishments.length,
      nombreCiclo: this.cycle.nombre
    }
    this.spinnerSee = true;
    this.usersService.exportGeneralAssistanceToPDF(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        this.fileName = resp.fileName;
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha exportado correctamente'
        });
        this.spinnerSee = false;
        window.location.assign(this.urlDownload + this.fileName);

      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al exportar el archivo'
        });
        this.spinnerSee = false;
      }
    })
  }

  deletePdf() {
    if (this.fileName != -1) {
      let data = {
        fileName: this.fileName
      }
      this.usersService.deletePDF(data).subscribe((resp: any) => { });
      this.fileName = -1;
    }
  }


  clearForm() {
    this.studentsPerLevel = [];
    this.studentsId = [];
    this.students = [];
    this.studentsAdd = [];
    this.removeStudents = [];
    this.addAssistants = [];
    this.addTeachers = [];
    this.removeAssistants = [];
    this.removeTeachers = [];
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
