import { Component, OnInit } from '@angular/core';
import { CoordinatorsService } from '../../services/coordinators.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CoordinatorModel } from 'src/models/coordinator.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-coordinators',
  templateUrl: './coordinators.component.html',
  styleUrls: ['./coordinators.component.scss']
})
export class CoordinatorsComponent implements OnInit {

  coordinators;
  coordinator = new CoordinatorModel();
  constructor(private coordinatorsService: CoordinatorsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listCoordinators();
  }

  listCoordinators() {
    this.coordinatorsService.getCoordinators().subscribe((resp: any) => {
      console.log(resp.coordinadores);
      this.coordinators = resp.coordinadores;
      console.log(this.coordinators);
    })
  }


  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  coordinatorFormCreate(rut, name, surname, email, modal) {
    console.log(rut, name, surname, email);
    let data = {
      rut,
      nombre: name,
      apellidos: surname,
      email
    };
    this.coordinatorsService.createCoordinator(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.code == 200) {
        modal.dismiss();
        Swal.fire({
          icon: 'success',
          title: 'Coordinador creado correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listCoordinators();
      } else {
        if (resp.code == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al crear el coordinador',
            text: resp.message
          });
        }
      }
    })
  }

  getCoordinator(id) {
    let data = {
      id
    };
    this.coordinatorsService.getCoordinatorById(data).subscribe((resp: any) => {
      console.log(id);
      console.log(resp);
      this.coordinator = resp.coordinador;
      console.log(this.coordinator);
    });
  }

  coordinatorFormEdit(form: NgForm, modal){
    this.coordinatorsService.editCoordinator(this.coordinator).subscribe((resp: any)=> {
      console.log(resp);
      if (resp.code == 200) {
        modal.dismiss();
        Swal.fire({
          icon: 'success',
          title: 'Coordinador editado correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listCoordinators();
      } else {
        if (resp.code == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al editar el coordinador',
            text: resp.message
          });
        }
      }
    })
  }

  deleteCoordinator(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Esta seguro que desea eliminar este coordinador?',
      text: "No se puede revertir esta operacion.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.coordinatorsService.deleteCoordinator(data).subscribe((resp: any) => {
          console.log(resp);
          if (resp.code == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Coordinador eliminado correctamente',
              showConfirmButton: false,
              timer: 2000
            });
            this.listCoordinators();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el coordinador',
              text: resp.id 
            });
          }
        })
      }
    })
  }
}
