import { AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable'; import { ActivitiesModel } from '../../../../../models/activities.model';
import { ActivitiesService } from '../../services/activities.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CycleService } from '../../../cycle/services/cycle.service';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { CycleModel } from '../../../../../models/cycle.model';
import { DataTableDirective } from 'angular-datatables';
import { CostsService } from '../../../costs/services/costs.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  activities;
  detailsPerCost;
  costs;
  cycles;
  cycle = new CycleModel();
  currentDate;
  activity = new ActivitiesModel();

  ids = [];
  total = 0;

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
    activityName: this.activity.nombre,
    details: this.fb.array([])
  });


  constructor(private activitiesService: ActivitiesService, private cycleService: CycleService, private costsService: CostsService ,private modalService: NgbModal, private fb: FormBuilder) {
    this.cicloOld = {};
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

  ngOnInit(): void {
    //this.listActivities();
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

  listActivities() {
    this.activitiesService.getActivities().subscribe((resp: any) => {
      this.activities = resp.actividades;
      this.rerender();
    })
  }

  listActivitiesPerCycle() {
    let data = {
      id: this.cycle.id
    };
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.activities = resp.actividades;
      this.rerender();
    })
  }

  listCycles() {
    this.cycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    })
  }

  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.cycleService.getCycleByFinishDate(data).subscribe(async (resp: any) => {
      if (resp.code == 200) {
        this.cycle = resp.ciclo;
        this.activities = resp.ciclo.actividades;
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
      this.activities = resp.actividades;
      this.rerender();
    })
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }

  activityFormCreate(name, description, date, modal) {
    let data = {
      nombre: name,
      descripcion: description,
      fecha: date,
      ciclo_id: this.cycle.id
    };
    this.activitiesService.createActivity(data).subscribe((resp: any) => {
      if (resp.code === 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha creado correctamente'
        });
        this.listActivitiesPerCycle();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores'
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al crear la actividad',
            text: resp.message
          });
        }
      }
    })
  }

  getActivity(id) {
    let data = {
      id
    };
    this.activitiesService.getActivityById(data).subscribe((resp: any) => {
      this.activity = resp.actividad;
      this.costs = resp.gastos;
    })
  }

  setActivity(activity) {
    this.activity = JSON.parse(JSON.stringify(activity));
  }

  getDetailsPerCost(cost) {
    this.detailsPerCost = cost.detalles;
  }

  activityFormEdit(form: NgForm, modal) {
    this.activitiesService.editActivity(this.activity).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Actividad editada correctamente',
        });
        this.listActivitiesPerCycle();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al editar la actividad',
            text: resp.message
          });
        }
      }
    })
  }

  deleteActivity(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar esta actividad?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activitiesService.deleteActivity(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Actividad eliminada correctamente',
            });
            this.listActivitiesPerCycle();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar la actividad',
              text: resp.id
            });
          }
        });
      }
    });
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
      let data = {
        valor: this.total,
        fecha: form.date,
        ciclo_id: this.cycle.id,
        actividad_id: this.activity.id
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
          this.getActivity(this.activity.id);
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
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Ingrese un detalle porfavor'
      });
    }
  }

  clearForm() {
    this.details.controls.splice(0, this.details.length);
    this.costsFormCreate.reset();
    this.ids = [];
    this.total = 0;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
