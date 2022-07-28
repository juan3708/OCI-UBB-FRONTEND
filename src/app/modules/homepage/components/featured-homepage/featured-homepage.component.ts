import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomepageService } from '../../services/homepage.service';

@Component({
  selector: 'app-featured-homepage',
  templateUrl: './featured-homepage.component.html',
  styleUrls: ['./featured-homepage.component.scss']
})
export class FeaturedHomepageComponent implements OnInit {

  noticias;
  recentPost = [];
  url = 'http://127.0.0.1:8000/storage/images/';
  constructor(private router:Router, private homepageService: HomepageService) { }

  ngOnInit(): void {
    this.listRecentPost();
  }

  listRecentPost() {
    this.homepageService.getRecentPost().subscribe((resp: any) => {
      if (resp.code == 200) {
        this.recentPost = resp.noticias;
      } else {
        this.recentPost = [];
      }
    })
  }

  onSelectNews(news) {
    let title = news.titulo.replaceAll(' ', '-').toLowerCase();
    this.router.navigate(['/news', title], {
      state: {
        news
      }
    });
  }

}
