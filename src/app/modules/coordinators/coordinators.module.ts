import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinatorsRoutingModule } from './coordinators-routing.module';
import { CoordinatorsComponent } from './components/coordinators/coordinators.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [CoordinatorsComponent],
  imports: [
    CommonModule,
    CoordinatorsRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CoordinatorsModule { }
