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

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  users;
  roles;
  ADMIN=1;
  COORDINADOR=2;
  PROFESOR=3;
  AYUDANTE=4;
  DIRECTOR=5;
  isTeacher;
  faculty = '';
  modality = '';
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

  onChangeRol(rol){
    if(rol == this.PROFESOR){
      this.isTeacher = true;
    }else{
      this.isTeacher = false;
    }
  }

  userFormCreate(rut, name, surname, email, rol, modal){
    let userData = {
      rut,
      nombre: name,
      apellidos: surname,
      password: rut.substring(0, 6),
      email,
      fecha_creacion: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      rol_id: rol
    };
    console.log(userData);
    this.usersService.register(userData).subscribe((resp:any)=>{
      if(resp.code == 200){
        if(rol == this.PROFESOR){
          let data = {
            rut, 
            nombre: name,
            apellidos: surname,
            email,
            facultad: this.faculty,
            modalidad: this.modality
          }
          console.log(data);
          this.teachersService.createTeacher(data).subscribe((resp: any)=>{
            console.log(resp);
            if(resp.code == 200){
              modal.dismiss();
              this.listUsers();
            }
          });
        }else{
          if(rol == this.ADMIN){
              modal.dismiss();
              this.listUsers();
          }else{
            if(rol == this.COORDINADOR){
              this.coordinatorsService.createCoordinator(userData).subscribe((resp: any)=>{
                if(resp.code == 200){
                  modal.dismiss();
                  this.listUsers();
                }
              });
            }else{
              if(rol == this.AYUDANTE){
                this.assistantsService.createAssistant(userData).subscribe((resp: any)=>{
                  if(resp.code == 200){
                    modal.dismiss();
                    this.listUsers();
                  }
                });
              }else{
                if(rol == this.DIRECTOR){
                  modal.dismiss();
                  this.listUsers();
                }
              }
            }
          }
        }
        this.Toast.fire({
          icon: 'success',
          title: 'Se ha creado correctamente el usuario'
        });
      }else{
        if (resp.code == 400) {
          this.Toast.fire({
            icon: 'error',
            title: 'Ingrese correctamente los valores'
          });
        } else {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al crear el usuario',
            text: resp.message
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
