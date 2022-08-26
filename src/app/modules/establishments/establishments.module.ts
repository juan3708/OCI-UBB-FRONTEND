import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstablishmentsRoutingModule } from './establishments-routing.module';
import { EstablishmentsComponent } from './components/establishments/establishments.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { Ng9RutModule } from 'ng9-rut';


@NgModule({
  declarations: [EstablishmentsComponent],
  imports: [
    CommonModule,
    EstablishmentsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    Ng9RutModule
  ]
})
export class EstablishmentsModule { }
