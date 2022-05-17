import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-single',
  templateUrl: './news-single.component.html',
  styleUrls: ['./news-single.component.scss']
})
export class NewsSingleComponent implements OnInit {

  single;
  constructor(private router: Router) { 
    this.single = this.router.getCurrentNavigation().extras.state.news;
  }

  ngOnInit(): void {
  }

}
