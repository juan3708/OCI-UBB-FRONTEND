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
  constructor(private establishmentService: EstablishmentsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listEstablishments();
  }

  listEstablishments(){
    this.establishmentService.getEstablishments().subscribe((resp:any)=>{
      console.log(resp.establecimientos);
      this.establishments=resp.establecimientos;
      console.log(this.establishments);
    })
  }

  openModal( ModalContent ) {
    this.modalService.open( ModalContent, { size : 'lg'} );
  }

  establishmentFormCreate(establishmentName, director, establishmentAddress, teacherPhoneNumber, teacherEmail, teacherName, establishmentEmail, establishmentPhoneNumber, modal) {
    console.log(establishmentName, director, establishmentAddress, teacherPhoneNumber, teacherEmail, teacherName, establishmentEmail, establishmentPhoneNumber);
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
    console.log(data);
    this.establishmentService.createEstablishment(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.code == 200) {
        modal.dismiss();
        Swal.fire({
          icon: 'success',
          title: 'Establecimiento creado correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listEstablishments();
      } else {
        if (resp.code == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          Swal.fire({
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
    this.establishmentService.getEstablishmentById(data).subscribe((resp: any) => {
      console.log(id);
      console.log(resp);
      this.establishment = resp.establecimiento;
      console.log(this.establishment);
    });
  }

  establishmentFormEdit(form: NgForm, modal){
    this.establishmentService.editEstablishment(this.establishment).subscribe((resp: any)=> {
      console.log(resp);
      if(resp.code == 200){
        modal.dismiss();
        Swal.fire({
          icon: 'success',
          title: 'Establecimiento editado correctamente',
          showConfirmButton: false,
          timer: 2000
        });
        this.listEstablishments();
      }else{
        if (resp.code == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al editar el establecimiento',
            text: resp.message
          });
        }
      }
    })
  }
}
