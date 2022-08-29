import { AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DetailsModel } from '../../../../../models/details.model';
import { CostsModel } from '../../../../../models/costs.model';
import { CostsService } from '../../services/costs.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CycleService } from '../../../cycle/services/cycle.service';
import { CycleModel } from '../../../../../models/cycle.model';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { DataTableDirective } from 'angular-datatables';
import { UsersService } from '../../../users/services/users.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.scss']
})
export class CostsComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  detail = new DetailsModel();
  detailsList;
  costs = [];
  costsExport;
  total;
  totalCost = 0;
  cost = new CostsModel();
  start_date;
  finish_date;
  spinnerSee = false;
  urlDownload = "http://127.0.0.1:8000/api/pdf/download/";
  fileName = -1;
  currentDate;
  students = [];
  contentSee = 0;
  competencies = [];
  activities = [];
  ids = [];
  cycles;
  cycle = new CycleModel();
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

  costsFormCreate = this.fb.group({
    date: new FormControl(''),
    price: new FormControl(''),
    activity: new FormControl,
    competition: new FormControl,
    details: this.fb.array([])
  });


  constructor(private costsService: CostsService, private modalService: NgbModal, private cycleService: CycleService, private usersService: UsersService, private fb: FormBuilder) {
    this.cicloOld = {};
  }

  ngOnInit(): void {
    //this.listCosts();
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    // this.getCyclePerFinishtDate();
    // this.listCycles();
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


  get details() {
    return this.costsFormCreate.controls["details"] as FormArray;
  }

  addDetail() {
    const detailFormGroup = this.fb.group({
      name: new FormControl(''),
      priceDetail: new FormControl(''),
    });
    this.details.push(detailFormGroup);
  }

  removeDetail(i: number) {
    if (this.details.value[i] != undefined) {
      this.ids.push(this.details.value[i].id);
    }
    this.details.removeAt(i);
  }

  listCosts() {
    this.costsService.getCosts().subscribe((resp: any) => {
      this.costs = resp.gastos;
      this.rerender();
    });
  }



  listCycles() {
    this.cycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    });
  }

  listCostsPerCycle() {
    let data = {
      id: this.cycle.id
    };
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.costs = resp.gastos;
      this.rerender();
    })
  }

  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.cycleService.getCycleByFinishDate(data).subscribe(async (resp: any) => {
      if (resp.code == 200) {
        this.cycle = resp.ciclo;
        this.costs = resp.gastos;
        this.competencies = resp.ciclo.competencias;
        this.activities = resp.ciclo.actividades;
        this.rerender();
      } else {
        this.competencies = [];
        this.activities = [];
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
      this.costs = resp.gastos;
      this.totalCost = resp.totalGastos;
      this.competencies = resp.ciclo.competencias;
      this.activities = resp.ciclo.actividades;
      this.rerender();
    })
  }

  getCost(id) {
    let data = {
      id
    };
    this.details.clear();
    this.costsService.getCostsById(data).subscribe((resp: any) => {
      this.cost = resp.gastos;
      this.detailsList = resp.gastos.detalles;
      this.setCostCreateForm();
    });
  }

  setCost(cost) {
    this.cost = JSON.parse(JSON.stringify(cost));
    this.detailsList = cost.detalles;
    this.setCostCreateForm();

  }

  setCostCreateForm() {
    this.costsFormCreate.reset();
    this.details.controls.splice(0, this.details.length);
    this.detailsList.map((d: any) => {
      const detailFormGroup = this.fb.group({
        id: d.id,
        name: d.nombre,
        priceDetail: d.valor
      });
      this.details.push(detailFormGroup);
    });

    this.costsFormCreate.patchValue({ 'date': this.cost.fecha });
    this.costsFormCreate.patchValue({ 'price': this.cost.valor });
    this.costsFormCreate.patchValue({ 'activity': this.cost.actividad_id });
    this.costsFormCreate.patchValue({ 'competition': this.cost.competencia_id });
    this.costsFormCreate.setControl('details', this.details);
  }

  createCosts(form, modal) {
    if (this.details.length > 0) {
      for (let index = 0; index < this.details.length; index++) {
        if (this.details.value[index].name != '') {
          this.total += Number(this.details.value[index].priceDetail);
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese un nombre al detalle'
          });
          return;
        }
      }
      if ((this.total + Number(this.totalCost)) > Number(this.cycle.presupuesto)) {
        this.Toast.fire({
          icon: 'error',
          title: 'No se puede crear el gasto: El valor total se excede del presupuesto'
        });
        this.total = 0;
      } else {
        let data = {
          valor: this.total,
          fecha: form.date,
          ciclo_id: this.cycle.id,
          actividad_id: form.activity,
          competencia_id: form.competition
        }
        this.costsService.createCosts(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            modal.dismiss();
            let gastos_id = resp.gastos.id;
            for (let index = 0; index < this.details.length; index++) {
              let dataDetail = {
                valor: this.details.value[index].priceDetail,
                nombre: this.details.value[index].name,
                gastos_id: gastos_id
              };
              this.costsService.createDetails(dataDetail).subscribe((resp: any) => {
                if (resp.code != 200) {
                  this.Toast.fire({
                    icon: 'error',
                    title: 'Error al crear detalle'
                  });
                  return;
                }
              })
            }
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha creado correctamente'
            });
            this.listCostsPerCycle();
            this.clearForm();
          } else {
            if (resp.code == 400) {
              this.Toast.fire({
                icon: 'error',
                title: 'Ingrese correctamente los valores'
              });
            } else {
              this.Toast.fire({
                icon: 'error',
                title: 'Error al crear un gasto',
                text: resp.message
              });
            }
            this.total = 0;
          }
        });
      }
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Ingrese un detalle por favor'
      });
    }
  }

  editCost(form, modal) {
    this.total = 0;
    if (this.details.length > 0) {
      for (let index = 0; index < this.details.length; index++) {
        if (this.details.value[index].name != '') {
          this.total += Number(this.details.value[index].priceDetail);
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese un nombre al detalle'
          });
          return;
        }
      }
      let data = {
        id: this.cost.id,
        valor: this.total,
        fecha: form.date,
        ciclo_id: this.cycle.id,
        actividad_id: form.activity,
        competencia_id: form.competition
      };
      this.costsService.editCosts(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          let gastos_id = resp.gastos.id;
          modal.dismiss();
          if (this.detailsList.length == this.details.length && this.ids.length == 0) { //Cuando no se elimina detalle y se modifican los que estan CORRECTO
            for (let index = 0; index < this.details.length; index++) {
              let dataDetail = {
                id: this.details.value[index].id,
                valor: this.details.value[index].priceDetail,
                nombre: this.details.value[index].name,
                gastos_id: gastos_id
              };
              this.costsService.editDetails(dataDetail).subscribe((resp: any) => {
                if (resp.code != 200) {
                  this.Toast.fire({
                    icon: 'error',
                    title: 'Error al editar detalle'
                  });
                  return;
                }
              })
            }
          } else if (this.detailsList.length <= this.details.length && this.ids.length >= 0) { //Cuando se elimina o no y se agregan mas de los que habian
            for (let index = 0; index < this.details.length; index++) {
              if (this.details.value[index].id != undefined) {
                let dataDetail = {
                  id: this.details.value[index].id,
                  valor: this.details.value[index].priceDetail,
                  nombre: this.details.value[index].name,
                  gastos_id: gastos_id
                };
                this.costsService.editDetails(dataDetail).subscribe((resp: any) => {
                  if (resp.code != 200) {
                    this.Toast.fire({
                      icon: 'error',
                      title: 'Error al editar detalle'
                    });
                    return;
                  }
                })
              } else {
                let dataDetail = {
                  valor: this.details.value[index].priceDetail,
                  nombre: this.details.value[index].name,
                  gastos_id: gastos_id
                };
                this.costsService.createDetails(dataDetail).subscribe((resp: any) => {
                  if (resp.code != 200) {
                    this.Toast.fire({
                      icon: 'error',
                      title: 'Error al crear detalle'
                    });
                    return;
                  }
                })
              }
            }
            for (let index = 0; index < this.ids.length; index++) {
              let data = {
                id: this.ids[index]
              };
              this.costsService.deleteDetails(data).subscribe((resp: any) => {
                if (resp.code != 200) {
                  this.Toast.fire({
                    icon: 'error',
                    title: 'Error al editar detalle'
                  });
                  return;
                }
              })
            }
          } else if (this.detailsList.length > this.details.length && this.ids.length > 0) { //Cuando se elimina, pero no se agregan mas de los que habian
            for (let index = 0; index < this.details.length; index++) {
              if (this.details.value[index].id != undefined) {
                let dataDetail = {
                  id: this.details.value[index].id,
                  valor: this.details.value[index].priceDetail,
                  nombre: this.details.value[index].name,
                  gastos_id: gastos_id
                };
                this.costsService.editDetails(dataDetail).subscribe((resp: any) => {
                  if (resp.code != 200) {
                    this.Toast.fire({
                      icon: 'error',
                      title: 'Error al editar detalle'
                    });
                    return;
                  }
                })
              } else {
                let dataDetail = {
                  valor: this.details.value[index].priceDetail,
                  nombre: this.details.value[index].name,
                  gastos_id: gastos_id
                };
                this.costsService.createDetails(dataDetail).subscribe((resp: any) => {
                  if (resp.code != 200) {
                    this.Toast.fire({
                      icon: 'error',
                      title: 'Error al crear detalle'
                    });
                    return;
                  }
                })
              }
            }
            for (let index = 0; index < this.ids.length; index++) {
              let data = {
                id: this.ids[index]
              };
              this.costsService.deleteDetails(data).subscribe((resp: any) => {
                if (resp.code != 200) {
                  this.Toast.fire({
                    icon: 'error',
                    title: 'Error al editar detalle'
                  });
                  return;
                }
              })
            }
          }
          this.listCostsPerCycle();
          this.clearForm();
          this.Toast.fire({
            icon: 'success',
            title: 'Se ha editado correctamente'
          });
        } else {
          if (resp.code == 400) {
            this.Toast.fire({
              icon: 'error',
              title: 'Ingrese correctamente los valores'
            });
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al editar un gasto',
              text: resp.message
            });
          }
        }
      });
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Ingrese un detalle por favor'
      });
    }
  }

  deleteCost(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar este gasto?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        for (let index = 0; index < this.detailsList.length; index++) {
          let data = {
            id: this.detailsList[index].id
          }
          this.costsService.deleteDetails(data).subscribe((resp: any) => {
            if (resp.code != 200) {
              this.Toast.fire({
                icon: 'error',
                title: 'Error al eliminar el detalle asociado al gasto'
              });
              return;
            }
          });
        }
        this.costsService.deleteCosts(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha eliminado correctamente'
            });
            this.listCostsPerCycle();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar el gasto'
            });
          }
        })
      }
    });
  }

  seeAsistance(start_date, finish_date) {
    let data = {
      ciclo_id: this.cycle.id,
      fecha_inicial: start_date,
      fecha_final: finish_date
    };
    if (start_date == "" || finish_date == "") {
      this.Toast.fire({
        icon: 'error',
        title: 'Debe ingresar ambas fechas'
      });
    } else {
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
      this.cycleService.getAssistancePerDateAndCycle(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          if (resp.estudiantesConEstadisticaDeAsistencia == undefined) {
            this.students = [];
          } else {
            this.students = resp.estudiantesConEstadisticaDeAsistencia;
          }
          Swal.close();
          this.contentSee = 1;
        } else if (resp.errors.fecha_final != undefined) {
          this.Toast.fire({
            icon: 'error',
            title: resp.errors.fecha_final
          });
          Swal.close();

        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al realizar la consulta'
          });
          Swal.close();

        }
      })
    }
  }


  getCostPerDateAndCycle(start_date, finish_date) {
    let data = {
      ciclo_id: this.cycle.id,
      fecha_inicial: start_date,
      fecha_final: finish_date
    };
    if (start_date == "" || finish_date == "") {
      this.Toast.fire({
        icon: 'error',
        title: 'Debe ingresar ambas fechas'
      });
    } else {
      this.start_date = start_date;
      this.finish_date = finish_date;
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
      this.costsService.getCostPerDateAndCycle(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          this.costsExport = resp.gastos;
          this.total = resp.totalGastado;
          Swal.close()
          this.contentSee = 1;
        } else if (resp.errors.fecha_final != undefined) {
          Swal.close()
          this.Toast.fire({
            icon: 'error',
            title: resp.errors.fecha_final
          });
        } else {
          Swal.close()
          this.Toast.fire({
            icon: 'error',
            title: 'Error al realizar la consulta'
          });
        }
      })
    }
  }

  exportPdf(modal) {
    let data = {
      nombreCiclo: this.cycle.nombre,
      fecha_inicio: this.start_date,
      fecha_final: this.finish_date,
      gastos: this.costsExport,
      totalGastado: this.total,
      presupuestoCiclo: this.cycle.presupuesto
    }
    this.spinnerSee = true;
    this.usersService.exportCosts(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        this.fileName = resp.fileName;
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha exportado correctamente'
        });
        this.spinnerSee = false;
        window.location.assign(this.urlDownload + this.fileName);
        modal.dismiss();
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
    this.costsExport = [];
    this.contentSee == 0;
  }

  clearForm() {
    this.details.controls.splice(0, this.details.length);
    this.costsFormCreate.reset();
    this.ids = [];
    this.contentSee = 0;
    this.students = [];
    this.costsExport = [];
    this.total = 0;
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }



  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
