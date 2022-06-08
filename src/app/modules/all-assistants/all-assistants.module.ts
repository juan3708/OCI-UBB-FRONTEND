import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllAssistantsRoutingModule } from './all-assistants-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AllAssistantsComponent } from './components/all-assistants/all-assistants.component';


@NgModule({
  declarations: [AllAssistantsComponent],
  imports: [
    CommonModule,
    AllAssistantsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class AllAssistantsModule { }
