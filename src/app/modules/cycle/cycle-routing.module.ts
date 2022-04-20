import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CycleComponent } from './components/cycle/cycle.component';

const routes: Routes = [
  {
    path: '',
    component: CycleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CycleRoutingModule { }
