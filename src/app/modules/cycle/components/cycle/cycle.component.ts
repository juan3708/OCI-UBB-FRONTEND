import { Component, OnDestroy, OnInit } from '@angular/core';
import { CycleService } from '../../services/cycle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormGroup, NgForm } from '@angular/forms';
import { CycleModel } from '../../../../../models/cycle.model';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.scss']
})
export class CycleComponent implements OnInit, OnDestroy {

  cycles;
  coordinators;
  cyclesEdit: FormGroup;
  cycle = new CycleModel;
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

  constructor(private CycleService: CycleService, private modalService: NgbModal){}

  ngOnInit(): void {
    this.listCycles();
    this.listCoordinators();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }

  listCycles(){
    this.CycleService.getCycles().subscribe((resp: any)=>{
      this.cycles = resp.ciclos;
      this.dtTrigger.next(void 0);
    });
  }

  listCoordinators(){
    this.CycleService.getCoordinators().subscribe((resp: any)=>{
      this.coordinators = resp.coordinadores;
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  cycleFormCreate(year, name, startDate, finishDate, budget, coordinator, modal){
    let data ={
      anio: year,
      nombre: name,
      fecha_inicio: startDate,
      fecha_termino: finishDate,
      presupuesto: budget,
      coordinador_id: coordinator
    };

    this.CycleService.createCycle(data).subscribe((resp:any)=>{
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

getCycle(id){
  let data ={
    id
  };
  this.CycleService.getCycleById(data).subscribe((resp: any)=>{
    this.cycle = resp.ciclo;
  })
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
              title: 'Error al eliminar el ciclo',
              text: resp.id 
            });
          }
        })
      }
    })
  }

  cycleFormEdit(form: NgForm, modal){
    this.CycleService.editCycle(this.cycle).subscribe((resp: any)=> {
      if(resp.code == 200){
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Ciclo editado correctamente'
        });
        this.listCycles();
      }else{
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
