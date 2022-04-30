import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssistantsComponent } from './components/assistants/assistants.component';

const routes: Routes = [
  {
    path: '',
    component: AssistantsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistantsRoutingModule { }
