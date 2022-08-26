import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LessonsRoutingModule } from './lessons-routing.module';
import { LessonsComponent } from './components/lessons/lessons.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { Ng9RutModule } from 'ng9-rut';


@NgModule({
  declarations: [LessonsComponent],
  imports: [
    CommonModule,
    LessonsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    Ng9RutModule
  ]
})
export class LessonsModule { }
