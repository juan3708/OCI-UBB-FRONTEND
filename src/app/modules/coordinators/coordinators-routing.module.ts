import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoordinatorsComponent } from './components/coordinators/coordinators.component';

const routes: Routes = [
  {
    path: '',
    component: CoordinatorsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinatorsRoutingModule { }
