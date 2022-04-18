import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstablishmentsRoutingModule } from './establishments-routing.module';
import { EstablishmentsComponent } from './components/establishments/establishments.component';


@NgModule({
  declarations: [EstablishmentsComponent],
  imports: [
    CommonModule,
    EstablishmentsRoutingModule
  ]
})
export class EstablishmentsModule { }
