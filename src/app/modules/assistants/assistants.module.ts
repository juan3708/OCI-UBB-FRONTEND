import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistantsRoutingModule } from './assistants-routing.module';
import { AssistantsComponent } from './components/assistants/assistants.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { Ng9RutModule } from 'ng9-rut';


@NgModule({
  declarations: [AssistantsComponent],
  imports: [
    CommonModule,
    AssistantsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    Ng9RutModule
  ]
})
export class AssistantsModule { }
