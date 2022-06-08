import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutHomepageComponent } from './components/about-homepage/about-homepage.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NewsHomepageComponent } from './components/news-homepage/news-homepage.component';
import { NewsSingleHomepageComponent } from './components/news-single-homepage/news-single-homepage.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'about',
    component: AboutHomepageComponent
  },
  {
    path: 'news',
    component: NewsHomepageComponent
  },
  {
    path: 'news/:title',
    component: NewsSingleHomepageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule { }
