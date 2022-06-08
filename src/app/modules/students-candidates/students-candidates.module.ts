import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsCandidatesRoutingModule } from './students-candidates-routing.module';
import { StudentsCandidatesComponent } from './components/students-candidates/students-candidates.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [StudentsCandidatesComponent],
  imports: [
    CommonModule,
    StudentsCandidatesRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class StudentsCandidatesModule { }
