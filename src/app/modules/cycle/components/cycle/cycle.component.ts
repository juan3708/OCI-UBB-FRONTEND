import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.scss']
})
export class CycleComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  cycles;
  coordinators;
  cyclesEdit: FormGroup;
  cycleModel = new CycleModel();
  cycle;
  establishmentsCycle: EstablishmentModel[] = [];
  establishmentsPerCycle = [];
  establishmentsPerCycleId = [];
  establishments = [];

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

  editFeeEstablishment = this.fb.group({
    establishmentsFee: this.fb.array([])
  });

  constructor(private CycleService: CycleService, private establishmentsService: EstablishmentsService, private fb: FormBuilder, private modalService: NgbModal) { }


  ngOnInit(): void {
    this.listCycles();
    this.listCoordinators();
    //this.listEstablishments();
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

  get establishmentsFee() {
    return this.editFeeEstablishment.controls["establishmentsFee"] as FormArray;
  }


  listCycles() {
    this.CycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
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
    this.CycleService.getCoordinators().subscribe((resp: any) => {
      this.coordinators = resp.coordinadores;
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

    this.CycleService.createCycle(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Ciclo creado correctamente'
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
      title: 'Espere porfavor...',
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
    this.CycleService.getCycleById(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.cycleModel = resp.ciclo;
      this.establishmentsPerCycle = resp.ciclo.establecimientos;
      this.establishments = resp.establecimientosSinCiclo
      this.setEditFeeForm();
      Swal.close();
      if(ModalContent != null){
      this.modalService.open(ModalContent, { size: 'xl' });
      }

    })
  }

  getStatisticPerCycle(id, modal) {
    let data = {
      ciclo_id: id
    }

    Swal.fire({
      title: 'Espere porfavor...',
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
    this.CycleService.getStatisticsPerCycle(data).subscribe(async (resp: any) => {
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
    console.log(this.student);

  }

  deleteCycle(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Esta seguro que desea eliminar este ciclo?',
      text: "No se puede revertir esta operacion.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.CycleService.deleteCycle(data).subscribe((resp: any) => {
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
    this.CycleService.editCycle(this.cycle).subscribe((resp: any) => {
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
        icon: 'error',
        title: 'Seleccione establecimientos porfavor'
      });
    } else {
      if (this.establishmentsPerCycleId.length == 0) {
        this.Toast.fire({
          icon: 'info',
          title: 'No se efectuaron mas cambios'
        });
        modal.dismiss();
        this.clearForm();
      } else {
        let data = {
          ciclo_id: this.cycle.id,
          establecimientos_id: this.establishmentsPerCycleId
        };
        this.CycleService.chargeEstablishments(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            modal.dismiss();
            this.Toast.fire({
              icon: 'success',
              title: 'Se asignaron correctamente los establecimientos'
            });
            this.clearForm();
            this.listCycles();
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
      title: '¿Esta seguro que desea eliminar al establecimiento de las OCI?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.CycleService.deleteEstablishments(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.establishmentsPerCycle.splice(this.establishmentsPerCycle.indexOf(establishment), 1);
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha eliminado correctamente',
            });
            this.getCycle(this.cycle.id, null);
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

    this.CycleService.updateEstablishments(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se asignaron correctamente los cupos'
        });
        this.clearForm();
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al asignar los cupos'
        });
      }
    })
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
