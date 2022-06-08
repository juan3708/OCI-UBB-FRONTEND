import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllNewsRoutingModule } from './all-news-routing.module';
import { AllNewsComponent } from './components/all-news/all-news.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [AllNewsComponent],
  imports: [
    CommonModule,
    AllNewsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DataTablesModule
  ]
})
export class AllNewsModule { }
