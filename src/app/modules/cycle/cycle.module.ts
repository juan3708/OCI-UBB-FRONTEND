import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CycleRoutingModule } from './cycle-routing.module';
import { CycleComponent } from './components/cycle/cycle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CycleComponent],
  imports: [
    CommonModule,
    CycleRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CycleModule { }
