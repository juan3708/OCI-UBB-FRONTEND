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
  lessons;
  lessonSee;
  cycles;
  establishments;
  bool;
  currentDate;
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
  teachers;
  assistants;
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
  constructor(private lessonsService: LessonsService, private cycleService: CycleService, private LevelService: LevelService, private EstablishmentsService: EstablishmentsService, private modalService: NgbModal) {
    this.cicloOld = {};
  }

  ngOnInit(): void {
    //this.listLessons();
    // this.listCycles();
    // this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
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
        this.getCycle(this.cicloNew.id);
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

  getLesson(id) {
    let data = {
      id
    };
    this.lessonsService.getLessonById(data).subscribe((resp: any) => {
      this.lesson = resp.clase;
      this.studentsLesson = resp.clase.alumnos;
      this.lessonAssistants = resp.clase.ayudantes;
      this.lessonTeachers = resp.clase.profesores;
      this.students = resp.alumnosSinClase;
      this.getLevelById(this.lesson.nivel_id);
      this.rerender();
    });

  }

  getStudentAssistancePerCycle(){
    let data = {
      ciclo_id : this.cycle.id
    }
    this.cycleService.getStudentAssistancePerCycle(data).subscribe((resp:any)=>{
      console.log(resp);
      if(resp.code == 200){
        if(resp.Establecimientos.length >=1){
        this.establishments = resp.Establecimientos;
        }else{
          this.establishments = [];
        }
      }else{
        this.Toast.fire({
          icon: 'error',
          title: 'Error al realizar la consulta'
        });
        this.establishments = [];
      }
    })
  }
  setLesson(lesson) {
    this.lesson = JSON.parse(JSON.stringify(lesson));
    this.studentsLesson = lesson.alumnos;
    this.lessonAssistants = lesson.ayudantes;
    this.lessonTeachers = lesson.profesores;
  }

  setStudent(student){
    this.student = JSON.parse(JSON.stringify(student));

  }
  getTeachersAndAssistants(id) {
    let data = {
      clase_id: id
    };
    this.lessonsService.getTeachersAndAssistants(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        this.assistants = resp.ayudantes;
        this.teachers = resp.profesores;
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al realizar la consulta'
        });
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
          this.listLessonsPerCycle();
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
          this.listLessonsPerCycle();
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
        this.listLessonsPerCycle();
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
            this.listLessonsPerCycle();
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
        title: 'Porfavor seleccione un nivel',
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

  addOrRemoveTeacher(event, teacher) {
    if (event) {
      this.addTeachers.push(teacher);
    } else {
      this.addTeachers.splice(this.addTeachers.indexOf(teacher), 1);
    }
  }

  addOrRemoveAssistant(event, assistant) {
    if (event) {
      this.addAssistants.push(assistant);
    } else {
      this.addAssistants.splice(this.addAssistants.indexOf(assistant), 1);
    }
  }

  removeStudentsPerLevelArray(student) {
    this.studentsPerLevel.splice(this.studentsPerLevel.indexOf(student), 1);
  }

  removeStudentsLessonArray(student) {
    this.studentsLesson.splice(this.studentsLesson.indexOf(student), 1);
    this.removeStudents.push(student);
    this.Toast.fire({
      icon: 'info',
      title: 'Se ha almacenado correctamente el alumno a eliminar',
    });
  }

  removeTeacherArray(teacher) {
    this.lessonTeachers.splice(this.lessonTeachers.indexOf(teacher), 1);
    this.removeTeachers.push(teacher);
    this.Toast.fire({
      icon: 'info',
      title: 'Se ha almacenado correctamente el profesor a eliminar',
    });
  }

  removeAssistantArray(assistant) {
    this.lessonAssistants.splice(this.lessonAssistants.indexOf(assistant), 1);
    this.removeAssistants.push(assistant);
    this.Toast.fire({
      icon: 'info',
      title: 'Se ha almacenado correctamente el ayudante a eliminar',
    });
  }

  changeStatusAssistance(event, student) {
    this.studentsAssistance[this.studentsId.indexOf(student)].asistencia = event;
  }

  concatStudentsArrays(modal) {
    if (this.studentsPerLevel.length >= 1) {
      this.studentsId = this.studentsPerLevel.map((s: any) => {
        return s.id;
      });
      this.studentsId = this.studentsId.concat(this.studentsAdd);
      this.studentsAdd = [];
      modal.dismiss();
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Porfavor seleccione un alumno',
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

  async chargeAssistance(lesson) {
    this.getLesson(lesson);
    await new Promise(f => setTimeout(f, 800));
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

  assignOrDesassignTeachersAndAssistants(modal) {
    var addAssistants = this.addAssistants;
    var removeAssistants = this.removeAssistants;
    var removeTeachers = this.removeTeachers;
    if (this.addTeachers.length == 0 && this.lessonTeachers.length == 0 && this.removeTeachers.length == 0 && this.removeAssistants.length == 0) {
      this.Toast.fire({
        icon: 'error',
        title: 'Error debe seleccionar un profesor'
      });
    } else {
      if (this.addTeachers.length >= 1) {
        let data = {
          clase_id: this.lesson.id,
          profesores_id: this.addTeachers
        };
        this.lessonsService.ChargeTeachers(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            if (removeTeachers.length >= 1) {
              let data = {
                clase_id: this.lesson.id,
                profesores_id: removeTeachers
              }
              this.lessonsService.DeleteTeachers(data).subscribe;
            }
            let data = {
              clase_id: this.lesson.id,
              ayudantes_id: addAssistants
            };
            this.Toast.fire({
              icon: 'success',
              title: 'Profesor(es) asignados correctamente'
            });
            if (addAssistants.length >= 1) {
              this.lessonsService.ChargeAssistants(data).subscribe((resp: any) => {
                if (resp.code == 200) {
                  if (removeAssistants.length >= 1) {
                    let data = {
                      clase_id: this.lesson.id,
                      ayudantes_id: removeAssistants
                    }
                    this.lessonsService.DeleteAssistants(data).subscribe;
                  }
                  this.Toast.fire({
                    icon: 'success',
                    title: 'Ayudante(s) asignados correctamente'
                  });
                  this.clearForm();
                  modal.dismiss();
                  return;
                } else {
                  this.Toast.fire({
                    icon: 'error',
                    title: 'Error al asignar el ayudante'
                  });
                  modal.dismiss();
                }
              })
            } else if (this.removeAssistants.length >= 1) {
              let data = {
                ayudantes_id: this.removeAssistants,
                clase_id: this.lesson.id
              };
              this.lessonsService.DeleteAssistants(data).subscribe((resp: any) => {
                if (resp.code == 200) {
                  this.Toast.fire({
                    icon: 'success',
                    title: 'Ayudante desasignado correctamente'
                  });

                } else {
                  this.Toast.fire({
                    icon: 'error',
                    title: 'Error al deasignar el ayudante'
                  });
                }
              })

            }
            modal.dismiss();
            this.clearForm();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al asignar el profesor'
            });
          }
        })
      } else if (this.removeTeachers.length >= 1 && this.teachers.length >= 1) {
        if (this.addTeachers.length >= 1) {
          let data = {
            clase_id: this.lesson.id,
            profesores_id: this.addTeachers
          };
          this.lessonsService.ChargeTeachers(data).subscribe((resp: any) => {
            if (resp.code == 200) {
              if (removeTeachers.length >= 1) {
                let data = {
                  clase_id: this.lesson.id,
                  profesores_id: removeTeachers
                }
                this.lessonsService.DeleteTeachers(data).subscribe;
              }
              let data = {
                clase_id: this.lesson.id,
                ayudantes_id: addAssistants
              };
              this.Toast.fire({
                icon: 'success',
                title: 'Profesor(es) asignados correctamente'
              });
              if (addAssistants.length >= 1) {
                this.lessonsService.ChargeAssistants(data).subscribe((resp: any) => {
                  if (resp.code == 200) {
                    if (removeAssistants.length >= 1) {
                      let data = {
                        clase_id: this.lesson.id,
                        ayudantes_id: removeAssistants
                      }
                      this.lessonsService.DeleteAssistants(data).subscribe;
                    }
                    this.Toast.fire({
                      icon: 'success',
                      title: 'Ayudante(s) asignados correctamente'
                    });
                    this.clearForm();
                    modal.dismiss();
                    return;
                  } else {
                    this.Toast.fire({
                      icon: 'error',
                      title: 'Error al asignar el ayudante'
                    });
                    modal.dismiss();
                  }
                })
              } else if (this.removeAssistants.length >= 1) {
                let data = {
                  ayudantes_id: this.removeAssistants,
                  clase_id: this.lesson.id
                };
                this.lessonsService.DeleteAssistants(data).subscribe((resp: any) => {
                  if (resp.code == 200) {
                    this.Toast.fire({
                      icon: 'success',
                      title: 'Ayudante desasignado correctamente'
                    });

                  } else {
                    this.Toast.fire({
                      icon: 'error',
                      title: 'Error al deasignar el ayudante'
                    });
                  }
                })

              }
              modal.dismiss();
              this.clearForm();
            } else {
              this.Toast.fire({
                icon: 'error',
                title: 'Error al asignar el profesor'
              });
            }
          })
        } else {
          let data = {
            profesores_id: this.removeTeachers,
            clase_id: this.lesson.id
          };
          this.lessonsService.DeleteTeachers(data).subscribe((resp: any) => {
            if (resp.code == 200) {
              this.Toast.fire({
                icon: 'success',
                title: 'Profesor desaignado correctamente'
              });
              modal.dismiss();
            } else {
              this.Toast.fire({
                icon: 'error',
                title: 'Error al deasignar el profesor'
              });
            }
          });
          if (this.removeAssistants.length >= 1) {
            let data2 = {
              ayudantes_id: this.removeAssistants,
              clase_id: this.lesson.id
            };
            this.lessonsService.DeleteAssistants(data2).subscribe((resp: any) => {
              if (resp.code == 200) {
                this.Toast.fire({
                  icon: 'success',
                  title: 'Ayudante desasignado correctamente'
                });
                modal.dismiss();
              } else {
                this.Toast.fire({
                  icon: 'error',
                  title: 'Error al deasignar el ayudante'
                });
              }
            })
          }
        }
      } else if (this.addAssistants.length >= 1) {
        let data = {
          ayudantes_id: this.addAssistants,
          clase_id: this.lesson.id
        }
        this.lessonsService.ChargeAssistants(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Ayudante asignado correctamente'
            });
            modal.dismiss();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al asignar ayudante'
            });
          }
        })

      } else if (this.removeAssistants.length >= 1) {
        let data = {
          ayudantes_id: this.removeAssistants,
          clase_id: this.lesson.id
        };
        this.lessonsService.DeleteAssistants(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Ayudante desasignado correctamente'
            });
            modal.dismiss();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al deasignar el ayudante'
            });
          }
        })
      }
    }
    this.clearForm();
  }

  addOrRemoveStudentPerLesson(modal) {
    if (this.removeStudents.length == 0 && this.studentsAdd.length == 0) {
      this.Toast.fire({
        icon: 'info',
        title: 'No se efectuaron cambios'
      });
      modal.dismiss();
    } else if (this.removeStudents.length >= 1 && this.studentsLesson.length == 0 && this.studentsAdd.length == 0) {
      this.Toast.fire({
        icon: 'error',
        title: 'Debe seleccionar un alumno'
      });
    } else {
      if (this.removeStudents.length >= 1) {
        let data = {
          clase_id: this.lesson.id,
          alumnos_id: this.removeStudents
        };
        this.lessonsService.removeStudents(data).subscribe((resp: any) => {
          if (resp.code != 200) {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar alumno de la clase'
            });
            modal.dismiss();
            return
          }
        });
        if (this.studentsAdd.length >= 1) {
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
              modal.dismiss();
              return
            }
          })
        }
        this.Toast.fire({
          icon: 'success',
          title: 'Se guardaron correctamente los cambios'
        });
        modal.dismiss();
        this.clearForm();
      } else {
        if (this.studentsAdd.length >= 1) {
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
              modal.dismiss();
              return
            }
          })
        }
        this.Toast.fire({
          icon: 'success',
          title: 'Se guardaron correctamente los cambios'
        });
        modal.dismiss();
        this.clearForm();
      }
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
