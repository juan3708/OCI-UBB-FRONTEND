import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllTeachersComponent } from './components/all-teachers/all-teachers.component';

const routes: Routes = [
  {
    path: '',
    component: AllTeachersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllTeachersRoutingModule { }
