import { formatDate } from '@angular/common';
import { AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { CycleService } from 'src/app/modules/cycle/services/cycle.service';
import { CycleModel } from 'src/models/cycle.model';
import { NewsModel } from 'src/models/news.model';
import Swal from 'sweetalert2';
import { AllNewsService } from '../../services/all-news.service';

@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  styleUrls: ['./all-news.component.scss']
})
export class AllNewsComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  cicloOld;
  cicloNew;
  ciclo;
  noticias;
  images;
  image;
  selectedFiles: File[] = Array();
  fileNames: string;
  url = 'http://127.0.0.1:8000/storage/images/';
  filesNamesArray: string[] = Array();
  new;
  cycle = new CycleModel();
  news;
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
  ToastImg = Swal.mixin({
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
  constructor(private allNewsService: AllNewsService, private modalService: NgbModal, private cycleService: CycleService) {
    this.cicloOld = {};
  }

  ngOnInit(): void {
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngDoCheck(): void {
    if (this.cycleService.cycle.id != undefined) {
      this.cicloNew = this.cycleService.cycle;
      if (this.cicloOld != this.cicloNew) {
        this.cicloOld = this.cicloNew;
        this.getCycle(this.cicloNew.id);
      }
    }
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

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }

  getCycle(id) {
    let data = {
      id
    };
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.cycle = resp.ciclo;
      this.noticias = resp.noticias;
      this.rerender();
    });
  }

  listNewsPerCycle() {
    let data = {
      id: this.cycle.id
    };
    this.cycleService.getCycleById(data).subscribe((resp: any) => {
      this.noticias = resp.noticias;
      this.rerender();
    })
  }

  newsFormCreate(title, lead, body, modal) {
    let data = {
      titulo: title,
      entrada: lead,
      cuerpo: body,
      fecha: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      ciclo_id: this.cycle.id
    };
    this.allNewsService.createNews(data).subscribe((resp: any) => {
      if (resp.code === 200) {
        let noticia_id = resp.noticia.id;
        if (this.selectedFiles.length >= 1) {
          for (let index = 0; index < this.selectedFiles.length; index++) {
            const formData = new FormData();
            formData.append('image', this.selectedFiles[index], this.filesNamesArray[index]);
            formData.append('noticia_id', noticia_id.toString());
            this.allNewsService.chargePhotosPerNews(formData).subscribe((resp: any) => {
            })
          }
          Swal.fire({
            title: 'Cargando imagenes',
            timer: 1000,
            didOpen: async () => {
              Swal.showLoading()
            },
          })
        }
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha creado correctamente'
        });
        modal.dismiss();
        this.listNewsPerCycle();
        this.clearForm();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores'
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al crear la noticia',
            text: resp.message
          });
        }
      }
    })
  }

  newsFormEdit(form: NgForm, modal) {
    var bool = false;
    this.allNewsService.editNews(this.news).subscribe((resp: any) => {
      if (resp.code == 200) {
        if (this.selectedFiles.length >= 1) {
          let noticia_id = resp.noticia.id;
          for (let index = 0; index < this.selectedFiles.length; index++) {
            const formData = new FormData();
            formData.append('image', this.selectedFiles[index], this.filesNamesArray[index]);
            formData.append('noticia_id', noticia_id.toString());
            this.allNewsService.chargePhotosPerNews(formData).subscribe();
            bool = true;
          }
        }
        if (bool == true) {
          Swal.fire({
            title: 'Noticia editada correctamente. Cargando imagenes, espere porfavor',
            timer: 2000,
            didOpen: async () => {
              Swal.showLoading();
            },
          })
        } else {
          this.Toast.fire({
            icon: 'success',
            title: 'Noticia editada correctamente',
          });
        }
        this.listNewsPerCycle();
        this.clearForm();
        modal.dismiss();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al editar la noticia',
            text: resp.message
          });
        }
      }
    })
  }

  editNews(news) {
    this.news = JSON.parse(JSON.stringify(news));
    this.images = news.adjuntos
  }

  setImage(image) {
    this.image = JSON.parse(JSON.stringify(image));
  }

  deleteImage(image) {
    let data = {
      id: image
    };
    Swal.fire({
      title: '¿Esta seguro que desea eliminar esta imagen?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.allNewsService.deleteImage(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.images.splice(this.images.indexOf(image), 1);
            this.Toast.fire({
              icon: 'success',
              title: 'Se ha eliminado correctamente',
            });
            this.listNewsPerCycle();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al realizar la acción',
              text: resp.message
            });
          }
        })
      }
    })
  }

  deleteNews(id) {
    let data = {
      id
    };
    Swal.fire({
      title: '¿Está seguro que desea eliminar esta noticia?',
      text: "No se puede revertir esta operación.",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.allNewsService.deleteNews(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: 'Noticia eliminada correctamente',
            });
            this.listNewsPerCycle();
          } else {
            this.Toast.fire({
              icon: 'error',
              title: 'Error al eliminar la noticia',
              text: resp.id
            });
          }
        });
      }
    });
  }

  onFileSelected(event) {
    this.clearForm();
    let bool;
    if (this.fileNames == undefined) {
      this.fileNames = '';
    }
    for (let index = 0; index < event.target.files.length; index++) {
      if (this.fileNames == '') {
        this.selectedFiles.push(<File>event.target.files[index]);
        this.fileNames = this.fileNames + this.selectedFiles[index].name + ', ';
        this.filesNamesArray.push(this.selectedFiles[index].name);
      } else {
        bool = this.fileNames.includes(event.target.files[index].name);
        if (bool == false) {
          this.selectedFiles.push(<File>event.target.files[index]);
          this.fileNames = this.fileNames + this.selectedFiles[index].name + ', ';
          this.filesNamesArray.push(this.selectedFiles[index].name);

        }
      }
    }
    this.fileNames = this.fileNames.slice(0, -2);
  }

  clearForm() {
    this.selectedFiles = Array();
    this.fileNames = undefined;
    this.filesNamesArray = Array();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
