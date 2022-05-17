import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllAssistantsComponent } from './components/all-assistants/all-assistants.component';

const routes: Routes = [
  {
    path: '',
    component: AllAssistantsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllAssistantsRoutingModule { }
