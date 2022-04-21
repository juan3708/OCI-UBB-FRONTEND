import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './components/students/students.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [StudentsComponent],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StudentsModule { }
