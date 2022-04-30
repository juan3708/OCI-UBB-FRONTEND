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
  coordinator = new CoordinatorModel();
  constructor(private coordinatorsService: CoordinatorsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listCoordinators();
  }

  listCoordinators() {
    this.coordinatorsService.getCoordinators().subscribe((resp: any) => {
      this.coordinators = resp.coordinadores;

    })
  }


  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  coordinatorFormCreate(rut, name, surname, email, modal) {
    let data = {
      rut,
      nombre: name,
      apellidos: surname,
      email
    };

    this.coordinatorsService.createCoordinator(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Coordinador creado correctamente'
        });
        this.listCoordinators();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
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
      this.coordinator = resp.coordinador;
    });
  }

  coordinatorFormEdit(form: NgForm, modal){
    this.coordinatorsService.editCoordinator(this.coordinator).subscribe((resp: any)=> {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Coordinador editado correctamente'
        });
        this.listCoordinators();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
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
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.coordinatorsService.deleteCoordinator(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Coordinador eliminado correctamente'
            });
            this.listCoordinators();
          } else {
            this.Toast.fire({
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