import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-single-homepage',
  templateUrl: './news-single-homepage.component.html',
  styleUrls: ['./news-single-homepage.component.scss']
})
export class NewsSingleHomepageComponent implements OnInit {

  single;
  url = 'http://127.0.0.1:8000/storage/images/';
  constructor(private router: Router) {
    this.single = this.router.getCurrentNavigation().extras.state.news;
  }

  ngOnInit(): void {
  }

  

}