import { AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { AssistantModel } from 'src/models/assistant.model';
import Swal from 'sweetalert2';
import { AssistantsService } from '../../services/assistants.service';
import { CycleService } from '../../../cycle/services/cycle.service';
import { CycleModel } from '../../../../../models/cycle.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-assistants',
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.scss']
})
export class AssistantsComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  assistants;
  currentDate;
  cycles;
  cycle = new CycleModel();
  assistant;
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
  constructor(private assistantsService: AssistantsService, private cycleService: CycleService,private modalService: NgbModal) { 
    this.cicloOld = {};
  }

  ngOnInit(): void {
    // this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    // this.getCyclePerFinishtDate();
    // this.listCycles();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }

  ngDoCheck(): void {
    if(this.cycleService.cycle.id != undefined){
      this.cicloNew = this.cycleService.cycle;
      if(this.cicloOld != this.cicloNew){
        this.cicloOld = this.cicloNew;
        this.getCycle(this.cicloNew.id);
      }
    }
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

  listCycles() {
    this.cycleService.getCycles().subscribe((resp: any) => {
      this.cycles = resp.ciclos;
    })
  }
  
  getCyclePerFinishtDate() {
    let data = {
      fecha_termino: this.currentDate
    };
    this.cycleService.getStudentsCandidatePerCyclePerFinishDate(data).subscribe((resp: any) => {
        this.cycle = resp.ciclo;
        this.listAssistantsPerCycle();
    })
  }

  getCycle(id) {
    let data = {
      ciclo_id: id
    };
    this.cycleService.getStudentsCandidatePerCycle(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.listAssistantsPerCycle();
    })
  }


  listAssistantsPerCycle() {
    let data = {
      ciclo_id: this.cycle.id
    }
    Swal.fire({
      title: 'Espere por favor...',
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {
        Swal.hideLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
    this.assistantsService.getAssistantsPerCycle(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        this.assistants = resp.ayudantes;
        this.rerender();
        Swal.close()

      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al cargar el ciclo'
        });
        Swal.close()

      }
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'lg' });
  }

  getAssistants(id) {
    let data = {
      id
    };
    this.assistantsService.getAssistantById(data).subscribe((resp: any) => {
      this.assistant = resp.ayudante;
    });
  }

  setAssistant(assistant){
    this.assistant = JSON.parse(JSON.stringify(assistant));
  }

  assistantFormCreate(rut, name, surname, email, modal) {
    let data = {
      rut,
      nombre: name,
      apellidos: surname,
      email
    };
    this.assistantsService.createAssistant(data).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Ayudante creado correctamente'
        });
        this.listAssistantsPerCycle();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al registrar al ayudante',
            text: resp.message
          });
        }
      }
    })
  }

  assistantFormEdit(form: NgForm, modal) {
    this.assistantsService.editAssistant(this.assistant).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Ayudante editado correctamente'
        });
        this.listAssistantsPerCycle();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al editar al ayudante',
            text: resp.message
          });
        }
      }
    })
  }

  deleteAssistant(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar este ayudante?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.assistantsService.deleteAssistant(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Ayudante eliminado correctamente'
            });
            this.listAssistantsPerCycle();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar al ayudante',
              text: resp.id
            });
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
