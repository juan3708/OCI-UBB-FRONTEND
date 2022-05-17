import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllStudentsRoutingModule } from './all-students-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AllStudentsComponent } from './components/all-students/all-students.component';


@NgModule({
  declarations: [AllStudentsComponent],
  imports: [
    CommonModule,
    AllStudentsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class AllStudentsModule { }
