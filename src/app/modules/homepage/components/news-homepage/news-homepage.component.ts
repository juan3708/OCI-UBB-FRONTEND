import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomepageService } from '../../services/homepage.service';

@Component({
  selector: 'app-news-homepage',
  templateUrl: './news-homepage.component.html',
  styleUrls: ['./news-homepage.component.scss']
})
export class NewsHomepageComponent implements OnInit {

  noticias;
  recentPost = [];
  url = 'http://127.0.0.1:8000/storage/images/';
  p: any;
  constructor(private router: Router, private homepageService: HomepageService) { }

  ngOnInit(): void {
    this.listAllNews();
    this.listRecentPost();
  }

  listAllNews() {
    this.homepageService.getNews().subscribe((resp: any) => {
      this.noticias = resp.noticias;
    })
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

  listNewsForWord(word) {
    if (word) {
      let data = {
        palabra: word
      };
      this.homepageService.getNewsLikeWord(data).subscribe((resp: any) => {
        if (resp.code == 200) {
          this.noticias = resp.noticias;
          console.log(this.noticias);
        }
      })
    } else {
      this.listAllNews();
    }
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
