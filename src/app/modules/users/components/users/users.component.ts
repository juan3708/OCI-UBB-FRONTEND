import { formatDate } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LanguageDataTable } from 'src/app/auxiliars/languageDataTable';
import { AssistantsService } from 'src/app/modules/assistants/services/assistants.service';
import { CoordinatorsService } from 'src/app/modules/coordinators/services/coordinators.service';
import { TeachersService } from 'src/app/modules/teachers/services/teachers.service';
import { UserModel } from 'src/models/users.model';
import Swal from 'sweetalert2';
import { UsersService } from '../../services/users.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  users;
  roles;
  check;
  ADMIN = 1;
  COORDINADOR = 2;
  PROFESOR = 3;
  AYUDANTE = 4;
  DIRECTOR = 5;
  isTeacher;
  faculty = '';
  modality = '';
  spinnerSee = false;
  user = new UserModel();
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
  constructor(private usersService: UsersService, private modalService: NgbModal, private teachersService: TeachersService, private assistantsService: AssistantsService, private coordinatorsService: CoordinatorsService) {
    this.isTeacher = false;
  }

  ngOnInit(): void {
    this.listUsers();
    this.listRoles();
    this.dtOptions = {
      language: LanguageDataTable.spanish_datatables,
      responsive: true
    };
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

  openModal(ModalContent) {
    this.modalService.open(ModalContent, { size: 'xl' });
  }

  listUsers() {
    this.usersService.getAllUsers().subscribe((resp: any) => {
      this.users = resp.usuarios;
      this.rerender();
    });
  }

  listRoles() {
    this.usersService.getRole().subscribe((resp: any) => {
      this.roles = resp.roles;
    });
  }

  setUser(user){
    this.user = JSON.parse(JSON.stringify(user));
  }

  onChangeRol(rol) {
    if (rol == this.PROFESOR) {
      this.isTeacher = true;
    } else {
      this.isTeacher = false;
    }
  }

  changeStatus(event,status, id) {
    let data = {
      user_id: id,
      activo: status
    }
    event.preventDefault();
    Swal.fire({
      title: '¿Está seguro que desea cambiar el estado a este usuario?',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.changeStatus(data).subscribe((resp: any) => {
          if (resp.code == 200) {
            this.Toast.fire({
              icon: 'success',
              title: resp.message
            });
            this.listUsers();
          } else {
            if (resp.code == 401) {
              this.Toast.fire({
                icon: 'error',
                title: resp.message
              });
            } else {
              this.Toast.fire({
                icon: 'error',
                title: 'Error al realizar la acción',
              });
            }
          }
        });
      }else{

      }
    });
  }

  userFormCreate(rut, name, surname, email, rol, modal) {
    let userData = {
      rut,
      nombre: name,
      apellidos: surname,
      password: rut.substring(0, 6),
      email,
      fecha_creacion: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      rol_id: rol,
      admin: 0
    };
    Swal.fire({
      title: 'Espere porfavor...',
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
    this.usersService.register(userData).subscribe((resp: any) => {
      if (resp.code == 200) {
        if (rol == this.PROFESOR) {
          let data = {
            rut,
            nombre: name,
            apellidos: surname,
            email,
            facultad: this.faculty,
            modalidad: this.modality
          }
          this.teachersService.createTeacher(data).subscribe((resp: any) => {
            if (resp.code == 200) {
              modal.dismiss();
              this.listUsers();
            }
          });
        } else {
          if (rol == this.ADMIN) {
            modal.dismiss();
            this.listUsers();
          } else {
            if (rol == this.COORDINADOR) {
              this.coordinatorsService.createCoordinator(userData).subscribe((resp: any) => {
                if (resp.code == 200) {
                  modal.dismiss();
                  this.listUsers();
                }
              });
            } else {
              if (rol == this.AYUDANTE) {
                this.assistantsService.createAssistant(userData).subscribe((resp: any) => {
                  if (resp.code == 200) {
                    modal.dismiss();
                    this.listUsers();
                  }
                });
              } else {
                if (rol == this.DIRECTOR) {
                  modal.dismiss();
                  this.listUsers();
                }
              }
            }
          }
        }
        Swal.close();
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha creado correctamente el usuario'
        });
      } else {
        if (resp.code == 400) {
          Swal.close();
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores'
          });
        } else {
          Swal.close();
          this.Toast.fire({
            icon: 'error',
            title: 'Error al crear el usuario',
            text: resp.message
          });
        }
      }
    });
  }

  userFormEdit(form: NgForm, modal) {
    this.usersService.edit(this.user).subscribe((resp: any) => {
      if (resp.code == 200) {
        modal.dismiss();
        this.Toast.fire({
          icon: 'success',
          title: 'Usuario editado correctamente'
        });
        this.listUsers();
      } else {
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores',
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al editar al Usuario',
            text: resp.message
          });
        }
      }
    })
  }

  sendMessages(subject, content, modal) {
    if (subject == '' || content == '') {
      this.Toast.fire({
        icon: 'error',
        title: 'Porfavor rellenar todo los campos con asterisco(*)'
      });
    } else {
      let data = {
        emails: this.user.email,
        subject,
        content,
        cycleName: 'Mensajeria OCI - UBB'
      };
      this.spinnerSee = true;
      this.usersService.sendMessage(data).subscribe((resp: any) => {
        console.log(resp);
        if (resp.code == 200) {
          this.Toast.fire({
            icon: 'success',
            title: 'Mensaje enviado correctamente'
          });
          modal.dismiss();
          this.spinnerSee = false;
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al enviar el mensaje'
          });
          this.spinnerSee = false;
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
