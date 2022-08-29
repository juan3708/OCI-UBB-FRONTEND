import { AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CycleService } from '../../services/cycle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormGroup, NgForm, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { CycleModel } from '../../../../../models/cycle.model';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { EstablishmentsService } from '../../../establishments/services/establishments.service';
import { EstablishmentModel } from '../../../../../models/establishment.model';
import { DataTableDirective } from 'angular-datatables';
import { UsersService } from '../../../users/services/users.service';
import { formatDate } from '@angular/common';
import { UserPagesService } from '../../../../user-pages/services/user-pages.service';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.scss']
})
export class CycleComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
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
  cycles = [];
  lengthCycles = 0;
  coordinators;
  cyclesEdit: FormGroup;
  cycleModel = new CycleModel();
  cycle;
  cycleSee = {
    establecimientos: Array(),
    establecimientoTieneCupos: false,
    alumnosParticipantes: 0,
    niveles: Array(),
    alumnos: Array(),
    nombre: ""
  }
  currentDate;
  spinnerSee = false;
  fileName = -1
  urlDownload = "http://127.0.0.1:8000/api/pdf/download/";
  establishmentsCycle: EstablishmentModel[] = [];
  establishmentsPerCycle = [];
  establishmentsPerCycleId = [];
  establishments = [];
  emailsArray = [];
  emailsRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/img;

  //VARIABLES ESTADISTICA OCI.
  cantEstablecimientos = 0;
  cantidadAlumnosInscritos = 0;
  cantidadAlumnosParticipantes = 0;
  cicloAnterior;
  competencias = [];
  diferenciaAlumnosInscritos = 0;
  diferenciaAlumnosParticipantes = 0;
  diferenciaEstablecimientos = 0;
  establecimientoMaxInscritos;
  establecimientoMaxParticipantes;
  establecimientoMinInscritos;
  establecimientoMinParticipantes;
  establecimientos = [];
  gastos;
  totalGastos = 0;
  prespuestoRestante = 0;
  student;


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

  Toast2 = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  editFeeEstablishment = this.fb.group({
    establishmentsFee: this.fb.array([])
  });

  constructor(private cycleService: CycleService, private establishmentsService: EstablishmentsService, private usersService: UsersService, private usersPagesService:UserPagesService ,private fb: FormBuilder, private modalService: NgbModal) { }


  ngOnInit(): void {
    this.listCycles();
    this.listCoordinators();
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    //this.listEstablishments();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }

  ngDoCheck(): void {
    if (this.cycleService.cycle.id != undefined) {
      this.cicloNew = this.cycleService.cycle;
      this.user = this.usersPagesService.getUser();
      if (this.cicloOld != this.cicloNew) {
        this.cicloOld = this.cicloNew;
        this.cycleSee = this.cycleService.cycle;
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

  get establishmentsFee() {
    return this.editFeeEstablishment.controls["establishmentsFee"] as FormArray;
  }


  listCycles() {
    this.cycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
      this.lengthCycles = this.cycles.length;
      this.rerender();
    });
  }

  listEstablishments() {
    this.establishmentsService.getEstablishments().subscribe((resp: any) => {
      this.establishments = resp.establecimientos;
      this.rerender();
    })
  }

  listCoordinators() {
    this.cycleService.getCoordinators().subscribe((resp: any) => {
      this.coordinators = resp.coordinadores;
      if (this.coordinators.length == 0) {
        this.Toast2.fire({
          icon: 'info',
          title: 'No existen coordinadores en el sistema, por favor crear uno'
        });
      }
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }


  cycleFormCreate(year, name, startDate, finishDate, budget, coordinator, modal) {
    let data = {
      anio: year,
      nombre: name,
      fecha_inicio: startDate,
      fecha_termino: finishDate,
      presupuesto: budget,
      coordinador_id: coordinator
    };

    this.cycleService.createCycle(data).subscribe(async (resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Ciclo creado correctamente'
        });
        await new Promise(f => setTimeout(f, 1000));
        Swal.fire('Se recargará el sistema para mejor funcionamiento');
        await new Promise(f => setTimeout(f, 1000));
        window.location.reload();

      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al crear el ciclo',
            text: resp.message
          });
        }
      }
    })
  }

  getCycle(id, ModalContent) {
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
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.cycleSee = resp.ciclo;
      this.establishmentsPerCycle = resp.ciclo.establecimientos;
      this.establishments = resp.establecimientosSinCiclo
      this.setEditFeeForm();
      this.cycleService.cycle = this.cycle;
      Swal.close();
      if (ModalContent != null) {
        this.modalService.open(ModalContent, { size: 'xl' });
      }
    })
  }

  assingCycle(id){
    let data = {
      id
    };
    this.cycleService.getCycleById(data).subscribe((resp:any)=>{
      this.cycleService.cycle = resp.ciclo;
    })
  }


  getStatisticPerCycle(id, modal) {
    let data = {
      ciclo_id: id
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
    this.cycleService.getStatisticsPerCycle(data).subscribe(async (resp: any) => {
      if (resp.code == 200) {
        this.cantEstablecimientos = Number(resp.cantEstablecimientos);
        this.cantidadAlumnosInscritos = Number(resp.cantidadAlumnosInscritos);
        this.cantidadAlumnosParticipantes = Number(resp.cantidadAlumnosParticipantes);
        this.cicloAnterior = resp.cicloAnterior;
        this.competencias = resp.competencias;
        this.diferenciaAlumnosInscritos = Number(resp.diferenciaAlumnosInscritos);
        this.diferenciaAlumnosParticipantes = Number(resp.diferenciaAlumnosParticipantes);
        this.diferenciaEstablecimientos = Number(resp.diferenciaEstablecimientos);
        this.establecimientoMaxInscritos = resp.establecimientoMaxInscritos;
        this.establecimientoMaxParticipantes = resp.establecimientoMaxParticipantes;
        this.establecimientoMinInscritos = resp.establecimientoMinInscritos;
        this.establecimientoMinParticipantes = resp.establecimientoMinParticipantes;
        this.establecimientos = resp.establecimientos;
        this.gastos = resp.gastos;
        this.totalGastos = resp.totalGastos;
        this.prespuestoRestante = Number(this.cycle.presupuesto) - Number(this.totalGastos);
        Swal.close()
        this.modalService.open(modal, { size: 'xl' });
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error cargar la información',
        });
        Swal.close()

      }
    })
  }

  setCycle(cycle) {
    this.cycle = JSON.parse(JSON.stringify(cycle));
  }

  setEditFeeForm() {
    this.establishmentsPerCycle.map((e: any) => {
      const establishmentsFeeForm = this.fb.group({
        id: e.id,
        nombre: new FormControl({ value: e.nombre, disabled: true }),
        cupos: e.pivot.cupos
      });
      this.establishmentsFee.push(establishmentsFeeForm);
    })
    this.editFeeEstablishment.setControl('establishmentsFee', this.establishmentsFee);
  }

  setStudent(student) {
    this.student = JSON.parse(JSON.stringify(student));

  }

  deleteCycle(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar este ciclo?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cycleService.deleteCycle(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Ciclo eliminado correctamente',
              showConfirmButton: false,
              timer: 2000
            });
            this.listCycles();
          } else {
            this.Toast.fire({
              icon: 'error',
              title
                : 'Error al eliminar el ciclo',
              text: resp.id
            });
          }
        })
      }
    })
  }

  cycleFormEdit(form: NgForm, modal) {
    this.cycleService.editCycle(this.cycle).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Ciclo editado correctamente'
        });
        this.listCycles();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al editar el ciclo',
            text: resp.message
          });
        }
      }
    })
  }


  addOrRemoveEstablishments(event, establishments) {
    if (event == true) {
      this.establishmentsPerCycleId.push(establishments);
    } else {
      this.establishmentsPerCycleId.splice(this.establishmentsPerCycleId.indexOf(establishments), 1);
    }
  }

  addEstablishmentsPerCycle(modal) {
    if (this.establishmentsPerCycleId.length < 1 && this.establishmentsPerCycle.length < 1) {
      this.Toast.fire({
        icon: 'info',
        title: 'No se efectuaron cambios'
      });
      this.assingCycle(this.cycle.id)
    } else {
      if (this.establishmentsPerCycleId.length == 0) {
        this.Toast.fire({
          icon: 'info',
          title: 'No se efectuaron más cambios'
        });
        modal.dismiss();
        this.clearForm();
        this.assingCycle(this.cycle.id)
      } else {
        let data = {
          ciclo_id: this.cycle.id,
          establecimientos_id: this.establishmentsPerCycleId
        };
        this.cycleService.chargeEstablishments(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            modal.dismiss();
            this.Toast.fire({
              icon: 'success',
              title: 'Se asignaron correctamente los establecimientos'
            });
            this.clearForm();
            this.listCycles();
            this.assingCycle(this.cycle.id)

          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al asignar los establecimientos'
            });
          }
        })
      }
    }
  }

  removeEstablishment(establishment) {
    let data = {
      ciclo_id: this.cycle.id,
      establecimiento_id: establishment
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar el establecimiento de las OCI?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cycleService.deleteEstablishments(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.establishmentsPerCycle.splice(this.establishmentsPerCycle.indexOf(establishment), 1);
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha eliminado correctamente',
            });
            if(this.cycle.establecimientos.length == 1){
              this.listCycles();
            }
            this.assingCycle(this.cycle.id);
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

  establishmentQuotesEdit(form, modal) {
    let ids = []
    let cupos = [];
    for (let index = 0; index < this.establishmentsFee.length; index++) {
      ids.push(this.establishmentsFee.value[index].id);
      cupos.push(this.establishmentsFee.value[index].cupos);
    }
    let data = {
      ciclo_id: this.cycle.id,
      establecimientos_id: ids,
      cupos: cupos
    };

    this.cycleService.updateEstablishments(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se asignaron correctamente los cupos'
        });
        this.clearForm();
        this.assingCycle(this.cycle.id);
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al asignar los cupos'
        });
      }
    })
  }

  sendInvitations(to, subject, content, formLink, modal) {
    if (subject == '' || content == '') {
      this.Toast.fire({
        icon: 'error',
        title: 'Por favor llenar todo los campos con asterisco(*)'
      });
    } else {
      this.establishments.forEach(e => {
        this.emailsArray.push(e.email, e.email_profesor);
      });
      if (to != '') {
        let bool = this.emailsRegex.test(to);
        if (bool) {
          this.emailsArray.push(to);
          let data = {
            emails: this.emailsArray,
            subject,
            content,
            formLink,
            start_date: this.cycle.fecha_inicio
          };
          this.spinnerSee = true;
          this.cycleService.sendEmails(data).subscribe((resp: any) => {
            if (resp.code == 200) {
              this.Toast.fire({
                icon: 'success',
                title: 'Mensajes enviados correctamente'
              });
              this.spinnerSee = false;
              modal.dismiss();
            } else {
              this.Toast.fire({
                icon: 'error',
                title: 'Error al enviar los mensajes'
              });
              this.spinnerSee = false;

            }
          })
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Formato de correo incorrecto'
          });
        }
      } else {
        let data = {
          emails: this.emailsArray,
          subject,
          content,
          formLink,
          start_date: this.cycle.fecha_inicio
        };
        this.spinnerSee = true;
        this.cycleService.sendEmails(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Mensajes enviados correctamente'
            });
            this.spinnerSee = false;
            modal.dismiss();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al enviar los mensajes'
            });
            this.spinnerSee = false;

          }
        })
      }
    }
  }

  exportPdf() {
    let data = {
      cantEstablecimientos: this.cantEstablecimientos,
      cantidadAlumnosInscritos: this.cantidadAlumnosInscritos,
      cantidadAlumnosParticipantes: this.cantidadAlumnosParticipantes,
      cicloAnterior: this.cicloAnterior,
      competencias: this.competencias,
      diferenciaAlumnosInscritos: this.diferenciaAlumnosInscritos,
      diferenciaAlumnosParticipantes: this.diferenciaAlumnosParticipantes,
      diferenciaEstablecimientos: this.diferenciaEstablecimientos,
      establecimientoMaxInscritos: this.establecimientoMaxInscritos,
      establecimientoMaxParticipantes: this.establecimientoMaxParticipantes,
      establecimientoMinInscritos: this.establecimientoMinInscritos,
      establecimientoMinParticipantes: this.establecimientoMinParticipantes,
      establecimientos: this.establecimientos,
      gastos: this.gastos,
      totalGastos: this.totalGastos,
      prespuestoRestante: this.prespuestoRestante,
      ciclo: this.cycle
    }
    this.spinnerSee = true;
    this.usersService.exportGeneralStatisticToPDF(data).subscribe((resp: any) => {
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
    this.establishmentsPerCycleId = [];
    this.establishmentsFee.controls.splice(0, this.establishmentsFee.length);
    this.editFeeEstablishment.reset();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
