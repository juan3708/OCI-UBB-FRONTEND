import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllTeachersRoutingModule } from './all-teachers-routing.module';
import { AllTeachersComponent } from './components/all-teachers/all-teachers.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [AllTeachersComponent],
  imports: [
    CommonModule,
    AllTeachersRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class AllTeachersModule { }
