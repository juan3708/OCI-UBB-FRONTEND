import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompetenciesModel } from '../../../../../models/competencies.model';
import { CompetenciesService } from '../../services/competencies.service';
import { CycleService } from '../../../cycle/services/cycle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { CycleModel } from '../../../../../models/cycle.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-competencies',
  templateUrl: './competencies.component.html',
  styleUrls: ['./competencies.component.scss']
})
export class CompetenciesComponent implements OnInit, OnDestroy {

  competition = new CompetenciesModel();
  cycles;
  cycle = new CycleModel();
  currentDate;
  competencies;
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

  constructor(private CompetenciesService: CompetenciesService, private CycleService: CycleService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listcycles();
    //this.listCompetencies();
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getCyclePerFinishtDate();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }

  listcycles() {
    this.CycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
      
    });
  }

  listCompetenciesPerCycle(){
    let data = {
      id: this.cycle.id
    };
    this.CycleService.getCycleById(data).subscribe((resp: any) => {
      this.competencies = resp.ciclo.competencias;
      this.dtTrigger.unsubscribe();
      this.dtTrigger.next(void 0);
    })
  }

  getCyclePerFinishtDate(){
    let data = {
      fecha_termino : this.currentDate
    };
    this.CycleService.getCycleByFinishDate(data).subscribe(async (resp: any)=>{
      if(resp.code == 200){
        this.cycle = resp.ciclo;
        this.competencies = resp.ciclo.competencias;
        this.dtTrigger.next(void 0);
      }else{
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
    this.CycleService.getCycleById(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.competencies = resp.ciclo.competencias;
      this.dtTrigger.unsubscribe();
      this.dtTrigger.next(void 0);
    })
  }

  listCompetencies() {
    this.CompetenciesService.getCompetencies().subscribe((resp: any) => {
      this.competencies = resp.competencias;
      this.dtTrigger.next(void 0);
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  competitionFormCreate(type, location,date, modal) {
    let data = {
      tipo: type,
      fecha: date,
      lugar: location,
      ciclo_id: this.cycle.id
    };
    this.CompetenciesService.createCompetencies(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha creado correctamente'
        });
        this.listCompetenciesPerCycle();
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
        this.listCompetenciesPerCycle();
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
            this.listCompetenciesPerCycle();
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}


