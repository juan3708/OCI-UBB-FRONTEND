import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompetenciesComponent } from './components/competencies/competencies.component';

const routes: Routes = [{
  path: '',
  component: CompetenciesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class CompetenciesRoutingModule { }
