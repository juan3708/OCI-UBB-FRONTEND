import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostsRoutingModule } from './costs-routing.module';
import { CostsComponent } from './components/costs/costs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [CostsComponent],
  imports: [
    CommonModule,
    CostsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class CostsModule { }
