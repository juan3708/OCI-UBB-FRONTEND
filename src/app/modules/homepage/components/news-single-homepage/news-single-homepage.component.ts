import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomepageService } from '../../services/homepage.service';

@Component({
  selector: 'app-news-single-homepage',
  templateUrl: './news-single-homepage.component.html',
  styleUrls: ['./news-single-homepage.component.scss']
})
export class NewsSingleHomepageComponent implements OnInit {

  single = {
    titulo: "",
    fecha: "",
    adjuntos: Array(),
    cuerpo: ""
  }
  recentPost = []
  url = 'http://127.0.0.1:8000/storage/images/';
  constructor(private router: Router, private homepageService: HomepageService) {
    if(this.router.getCurrentNavigation().extras.state != undefined){
    this.single = this.router.getCurrentNavigation().extras.state.news;
    }else{
      this.router.navigateByUrl('/news');
    }
  }

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
