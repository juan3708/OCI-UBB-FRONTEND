import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AllNewsComponent } from "./components/all-news/all-news.component";

const routes: Routes = [
  {
    path: "",
    component: AllNewsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllNewsRoutingModule {}
