import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllStudentsRoutingModule } from './all-students-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AllStudentsComponent } from './components/all-students/all-students.component';
import { Ng9RutModule } from 'ng9-rut';


@NgModule({
  declarations: [AllStudentsComponent],
  imports: [
    CommonModule,
    AllStudentsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    Ng9RutModule
  ]
})
export class AllStudentsModule { }
