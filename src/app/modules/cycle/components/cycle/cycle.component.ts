import { Component, OnInit } from '@angular/core';
import { CycleService } from '../../services/cycle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormGroup, NgForm } from '@angular/forms';
import { CycleModel } from '../../../../../models/cycle.model';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.scss']
})
export class CycleComponent implements OnInit {

  cycles;
  coordinators;
  cyclesEdit: FormGroup;
  cycle = new CycleModel;

  constructor(private CycleService: CycleService, private modalService: NgbModal){}

  ngOnInit(): void {
    this.listCycles();
    this.listCoordinators();
  }

  listCycles(){
    this.CycleService.getCycles().subscribe((resp: any)=>{
      console.log(resp.ciclos);
      this.cycles = resp.ciclos;
      console.log(this.cycles);
    });
  }

  listCoordinators(){
    this.CycleService.getCoordinators().subscribe((resp: any)=>{
      console.log(resp.coordinadores);
      this.coordinators = resp.coordinadores;
      console.log(this.coordinators);
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  cycleFormCreate(year, name, startDate, finishDate, budget, coordinator, modal){
    console.log(year, name, startDate, finishDate, budget, coordinator); 
    let data ={
      anio: year,
      nombre: name,
      fecha_inicio: startDate,
      fecha_termino: finishDate,
      presupuesto: budget,
      coordinador_id: coordinator
    };

    this.CycleService.createCycle(data).subscribe((resp:any)=>{
      console.log(resp);
      if (resp.code == 200) {
        modal.dismiss();
        Swal.fire({
          icon: 'success',
          title: 'Ciclo creado correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listCycles();
      } else {
        if (resp.code == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          Swal.fire({
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
    console.log(id);
    console.log(resp);
    this.cycle = resp.ciclo;
    console.log(this.cycle);
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
          console.log(resp);
          if (resp.code == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Ciclo eliminado correctamente',
              showConfirmButton: false,
              timer: 2000
            });
            this.listCycles();
          } else {
            Swal.fire({
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
      console.log(resp);
      if(resp.code == 200){
        modal.dismiss();
        Swal.fire({
          icon: 'success',
          title: 'Ciclo editado correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listCycles();
      }else{
        if (resp.code == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al editar el ciclo',
            text: resp.message
          });
        }
      }
    })
  }

}
