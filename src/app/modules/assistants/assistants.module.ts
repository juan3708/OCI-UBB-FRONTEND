import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistantsRoutingModule } from './assistants-routing.module';
import { AssistantsComponent } from './components/assistants/assistants.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AssistantsComponent],
  imports: [
    CommonModule,
    AssistantsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AssistantsModule { }
