import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllStudentsComponent } from './components/all-students/all-students.component';

const routes: Routes = [
  {
    path: '',
    component: AllStudentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllStudentsRoutingModule { }
