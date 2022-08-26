import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsCandidatesRoutingModule } from './students-candidates-routing.module';
import { StudentsCandidatesComponent } from './components/students-candidates/students-candidates.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng9RutModule } from 'ng9-rut';


@NgModule({
  declarations: [StudentsCandidatesComponent],
  imports: [
    CommonModule,
    StudentsCandidatesRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    Ng9RutModule
  ]
})
export class StudentsCandidatesModule { }
