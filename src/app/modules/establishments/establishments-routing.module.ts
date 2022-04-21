import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstablishmentsComponent } from './components/establishments/establishments.component';

const routes: Routes = [
  {
    path: '',
    component: EstablishmentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstablishmentsRoutingModule { }
