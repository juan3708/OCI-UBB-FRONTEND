import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompetenciesRoutingModule } from './competencies-routing.module';
import { CompetenciesComponent } from './components/competencies/competencies.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { Ng9RutModule } from 'ng9-rut';


@NgModule({
  declarations: [CompetenciesComponent],
  imports: [
    CommonModule,
    CompetenciesRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    Ng9RutModule
  ]
})
export class CompetenciesModule { }
