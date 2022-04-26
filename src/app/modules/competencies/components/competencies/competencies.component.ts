import { Component, OnInit } from '@angular/core';
import { CompetenciesModel } from '../../../../../models/competencies.model';
import { CompetenciesService } from '../../services/competencies.service';
import { CycleService } from '../../../cycle/services/cycle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-competencies',
  templateUrl: './competencies.component.html',
  styleUrls: ['./competencies.component.scss']
})
export class CompetenciesComponent implements OnInit {

  competition = new CompetenciesModel();
  cycles;
  competencies;
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

  constructor(private CompetenciesService: CompetenciesService, private CycleService: CycleService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listcycles();
    this.listCompetencies();
  }

  listcycles() {
    this.CycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    });
  }

  listCompetencies() {
    this.CompetenciesService.getCompetencies().subscribe((resp: any) => {
      this.competencies = resp.competencias;
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  competitionFormCreate(type, location,date, cycle, modal) {
    let data = {
      tipo: type,
      fecha: date,
      lugar: location,
      ciclo_id: cycle
    };
    this.CompetenciesService.createCompetencies(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha creado correctamente'
        });
        this.listCompetencies();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores'
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al crear una competencia',
            text: resp.message
          });
        }
      }
    });
  }

  getCompetition(id) {
    let data = {
      id
    };
    this.CompetenciesService.getCompetitionById(data).subscribe((resp: any) => {
      this.competition = resp.competencia
    });
  }

  competitionFormEdit(form: NgForm, modal) {
    this.CompetenciesService.editCompetition(this.competition).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha editado correctamente'
        });
        this.listCompetencies();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'success',
            title: 'Ingrese correctamente los valores'
          });
        } else {
          this.Toast.fire({
            icon: 'success',
            title: 'Error al editar una competencia',
            text: resp.message
          });
        }
      }
    });
  }

  deleteCompetition(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar esta competencia?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.CompetenciesService.deleteCompetition(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha eliminado correctamente'
            });
            this.listCompetencies();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar la competencia'
            });
          }
        });
      }
    });
  }

}


