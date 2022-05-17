import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllEstablishmentsRoutingModule } from './all-establishments-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { AllEstablishmentsComponent } from './components/all-establishments/all-establishments.component';


@NgModule({
  declarations: [AllEstablishmentsComponent],
  imports: [
    CommonModule,
    AllEstablishmentsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class AllEstablishmentsModule { }
