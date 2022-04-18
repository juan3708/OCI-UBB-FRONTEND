import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoordinatorsRoutingModule } from './coordinators-routing.module';
import { CoordinatorsComponent } from './components/coordinators/coordinators.component';


@NgModule({
  declarations: [CoordinatorsComponent],
  imports: [
    CommonModule,
    CoordinatorsRoutingModule
  ]
})
export class CoordinatorsModule { }
