import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NavbarHomepageComponent } from './components/navbar-homepage/navbar-homepage.component';
import { FooterHomepageComponent } from './components/footer-homepage/footer-homepage.component';
import { FeaturedHomepageComponent } from './components/featured-homepage/featured-homepage.component';
import { ContactHomepageComponent } from './components/contact-homepage/contact-homepage.component';
import { HeroHomepageComponent } from './components/hero-homepage/hero-homepage.component';
import { AboutHomepageComponent } from './components/about-homepage/about-homepage.component';
import { NewsHomepageComponent } from './components/news-homepage/news-homepage.component';
import { NewsSingleHomepageComponent } from './components/news-single-homepage/news-single-homepage.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [HomepageComponent, NavbarHomepageComponent, FooterHomepageComponent, FeaturedHomepageComponent, ContactHomepageComponent, HeroHomepageComponent, AboutHomepageComponent, NewsHomepageComponent, NewsSingleHomepageComponent],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    FormsModule
  ]
})
export class HomepageModule { }
