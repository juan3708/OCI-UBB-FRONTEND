import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentsCandidatesComponent } from './components/students-candidates/students-candidates.component';

const routes: Routes = [
  {
    path: '',
    component: StudentsCandidatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsCandidatesRoutingModule { }
