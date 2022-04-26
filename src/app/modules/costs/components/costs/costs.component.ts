import { Component, OnInit } from '@angular/core';
import { DetailsModel } from '../../../../../models/details.model';
import { CostsModel } from '../../../../../models/costs.model';
import { CostsService } from '../../services/costs.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CycleService } from '../../../cycle/services/cycle.service';
import { CycleModel } from '../../../../../models/cycle.model';
import { FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.scss']
})
export class CostsComponent implements OnInit {

  detail = new DetailsModel();
  detailsList;
  costEdit = new CostsModel();
  costs;
  cost;
  competencies = [];
  activities = [];
  cycles;
  cycle = new CycleModel();
  total = 0;
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
    cycle: new FormControl,
    activity: new FormControl,
    competition: new FormControl,
    details: this.fb.array([])
  });

  constructor(private CostsService: CostsService, private modalService: NgbModal, private CycleService: CycleService, private fb: FormBuilder) { }

  get details() {
    return this.costsFormCreate.controls["details"] as FormArray;
  }
  get name() { return this.costsFormCreate.get('name'); }


  addDetail() {
    const detailFormGroup = this.fb.group({
      name: new FormControl(''),
      priceDetail: new FormControl('0'),
    });
    this.details.push(detailFormGroup);
  }

  removeDetail(i: number) {
    this.details.removeAt(i);
  }

  clearForm() {
    this.details.controls.splice(0, this.details.length);
    this.costsFormCreate.reset();
    this.competencies = [];
    this.activities = [];
  }

  createCosts(form, modal) {
    if (this.details.length > 0) {
      for (let index = 0; index < this.details.length; index++) {
        if (this.details.value[index].name != '') {
          this.total += Number(this.details.value[index].priceDetail);
        }else{
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
        ciclo_id: form.cycle,
        actividad_id: form.activity,
        competencia_id: form.competition
      }
      this.CostsService.createCosts(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          modal.dismiss();
          let gastos_id = resp.gastos.id;
          for (let index = 0; index < this.details.length; index++) {
            let dataDetail = {
              valor: this.details.value[index].priceDetail,
              nombre: this.details.value[index].name,
              gastos_id: gastos_id
            };
            this.CostsService.createDetails(dataDetail).subscribe((resp: any) => {
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
          this.listCosts();
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
        }
      });
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Ingrese un detalle porfavor'
      });
    }
  }

  ngOnInit(): void {
    this.listCosts();
    this.listCycles();
  }


  listCosts() {
    this.CostsService.getCosts().subscribe((resp: any) => {
      this.costs = resp.gastos;
    });
  }



  listCycles() {
    this.CycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    });
  }

  chargeForCycle(id) {
    let data = {
      id
    };
    this.CycleService.getCycleById(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      if (resp.code == 200) {
        this.competencies = resp.ciclo.competencias;
        this.activities = resp.ciclo.actividades;
      } else {
        this.competencies = [];
        this.activities = [];
      }
    })
  };

  getCost(id) {
    let data = {
      id
    };
    this.CostsService.getCostsById(data).subscribe((resp: any) => {
      this.cost = resp.gastos;
      this.detailsList = resp.gastos.detalles;
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
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
          this.CostsService.deleteDetails(this.detailsList[index].id).subscribe((resp: any) => {
            if (resp.code != 200) {
              this.Toast.fire({
                icon: 'error',
                title: 'Error al eliminar el detalle asociado al gasto'
              });
              return;
            }
          });
        }
        this.CostsService.deleteCosts(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha eliminado correctamente'
            });
            this.listCosts();
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

}
