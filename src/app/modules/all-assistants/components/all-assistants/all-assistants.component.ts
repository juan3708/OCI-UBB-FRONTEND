import { AfterViewInit,Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { AssistantsService } from 'src/app/modules/assistants/services/assistants.service';
import { AssistantModel } from 'src/models/assistant.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-assistants',
  templateUrl: './all-assistants.component.html',
  styleUrls: ['./all-assistants.component.scss']
})
export class AllAssistantsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  
  assistants;
  assistant = new AssistantModel();
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
  constructor(private assistantsService: AssistantsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.listAssistants();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true,
    }
  };

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  rerender(): void {
    if("dtInstance" in this.dtElement){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
    else{
      this.dtTrigger.next();
    }
  }

  listAssistants() {
    this.assistantsService.getAssistants().subscribe((resp: any) => {
      this.assistants = resp.ayudantes;
      this.rerender();
    });
  }

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
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
        this.listAssistants();
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
        this.listAssistants();
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
            this.listAssistants();
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
