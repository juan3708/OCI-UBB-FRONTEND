import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllEstablishmentsComponent } from './components/all-establishments/all-establishments.component';

const routes: Routes = [
  {
    path: '',
    component: AllEstablishmentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllEstablishmentsRoutingModule { }
