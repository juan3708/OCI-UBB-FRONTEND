import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EstablishmentModel } from 'src/models/establishment.model';
import Swal from 'sweetalert2';
import { EstablishmentsService } from '../../services/establishments.service';

@Component({
  selector: 'app-establishments',
  templateUrl: './establishments.component.html',
  styleUrls: ['./establishments.component.scss']
})
export class EstablishmentsComponent implements OnInit {

  establishments;
  establishment = new EstablishmentModel();
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
  constructor(private establishmentsService: EstablishmentsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listEstablishments();
  }

  listEstablishments(){
    this.establishmentsService.getEstablishments().subscribe((resp:any)=>{
      this.establishments=resp.establecimientos;
    })
  }

  openModal( ModalContent ) {
    this.modalService.open( ModalContent, { size : 'lg'} );
  }

  establishmentFormCreate(establishmentName, director, establishmentAddress, teacherPhoneNumber, teacherEmail, teacherName, establishmentEmail, establishmentPhoneNumber, modal) {
    let data = {
      nombre: establishmentName,
      director,
      direccion: establishmentAddress,
      telefono_profesor: teacherPhoneNumber,
      email_profesor: teacherEmail,
      nombre_profesor: teacherName,
      email: establishmentEmail,
      telefono: establishmentPhoneNumber
    };
    this.establishmentsService.createEstablishment(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Establecimiento creado correctamente'
        });
        this.listEstablishments();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al registrar el establecimiento',
            text: resp.message
          });
        }
      }
    })
  }

  getEstablishment(id) {
    let data = {
      id
    };
    this.establishmentsService.getEstablishmentById(data).subscribe((resp: any) => {
      this.establishment = resp.establecimiento;
    });
  }

  establishmentFormEdit(form: NgForm, modal){
    this.establishmentsService.editEstablishment(this.establishment).subscribe((resp: any)=> {
      if(resp.code == 200){
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Establecimiento editado correctamente'
        });
        this.listEstablishments();
      }else{
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al editar el establecimiento',
            text: resp.message
          });
        }
      }
    })
  }

  deleteEstablishment(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar este establecimiento?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.establishmentsService.deleteEstablecimiento(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Establecimiento eliminado correctamente',
              showConfirmButton: false,
              timer: 2000
            });
            this.listEstablishments();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar el establecimiento',
              text: resp.id 
            });
          }
        })
      }
    })
  }
}
