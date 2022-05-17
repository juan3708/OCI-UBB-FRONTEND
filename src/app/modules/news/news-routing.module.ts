import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsSingleComponent } from './components/news-single/news-single.component';
import { NewsComponent } from './components/news/news.component';

const routes: Routes = [
  {
    path: '',
    component: NewsComponent
  },
  {
    path: ':title',
    component: NewsSingleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
